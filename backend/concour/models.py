from django.db import models
from django.contrib.auth.models import User
from .choices import COURSE_PART_CHOICES, TOPIC_PART_CHOICES
from django.utils.text import slugify
from django.utils import timezone

class Level(models.Model):
    name = models.CharField(max_length=20, unique=True)
    slug = models.SlugField(max_length=30, unique=True, blank=True, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class University(models.Model):
    name = models.CharField(max_length=100, unique=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, 
                            related_name='universities')
    is_open = models.BooleanField(default=True)
    slug = models.SlugField(max_length=30, unique=True, blank=True, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.level.name})"

class Year(models.Model):
    year = models.IntegerField()
    university = models.ForeignKey(University, on_delete=models.CASCADE, 
                                related_name='years')
    slug = models.SlugField(max_length=30, unique=True, blank=True, 
                            db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.year}-{self.university.slug}")
        super().save(*args, **kwargs)
    class Meta:
        unique_together = ('year', 'university')
        ordering = ['-year']  

    def __str__(self):
        return f"{self.year} - {self.university.name}"  

class Subject(models.Model):
    name = models.CharField(max_length=50)
    year = models.ForeignKey(Year, on_delete=models.CASCADE, related_name='subjects')
    slug = models.SlugField(max_length=30, unique=True, blank=True, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    class Meta:
        unique_together = ('name', 'year')

    def __str__(self):
        return f"{self.name} - {self.year.year}"

class Concours(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="concours")
    timer = models.DurationField(blank=True, null=True)
    #add note type
    slug = models.SlugField(max_length=30, unique=True, blank=True, db_index=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.subject.name}-{self.subject.year.year}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Concours ({self.subject.name})"

class Question(models.Model):
    concours = models.ForeignKey(Concours, on_delete=models.CASCADE, related_name="questions")
    question = models.TextField()
    explanation = models.TextField(blank=True, null=True)
    # link a question to an exercise context (one ExerciceContext can have many questions)
    exercice_context = models.ForeignKey(
        'ExerciceContext',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='questions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  
    def __str__(self):
        return f"Q: {self.question[:50]}"
    
class ExerciceContext(models.Model):
    
    context_text= models.TextField(blank=True, null=True) 

    def __str__(self):
        return f"Context: {self.context_text[:60] if self.context_text else 'Empty'}"

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class Score(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="score_user")
    concours = models.ForeignKey(Concours, on_delete=models.CASCADE, related_name="scores_concours", blank=True, null=True)  
    score = models.IntegerField()
    time_spent = models.DurationField()
   
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  

    def __str__(self):
        return f"{self.user.username} - {self.concours.subject.name}: {self.score}"

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_answers_user")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="user_answers_question")
    user_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    concours = models.ForeignKey(Concours, on_delete=models.CASCADE, related_name='user_answers_concours')
    created_at = models.DateTimeField(auto_now_add=True)
    score = models.ForeignKey(Score, on_delete=models.CASCADE, related_name="user_answers_score", null=True, blank=True)

    def is_correct(self):
        return self.user_choice.is_correct