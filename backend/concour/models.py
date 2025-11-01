from django.db import models
from django.contrib.auth.models import User
from .choices import COURSE_PART_CHOICES, TOPIC_PART_CHOICES
from django.utils.text import slugify
from django.utils import timezone
import random


class University(models.Model):
    name = models.CharField(max_length=100, unique=True)
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
    slug = models.SlugField(max_length=30, unique=True, blank=True,db_index=True)

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
    order = models.PositiveIntegerField(default=0)    
    exercice_context = models.ForeignKey('ExerciceContext',on_delete=models.SET_NULL,blank=True,null=True,related_name='questions')

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(fields=['concours', 'order'], name='unique_order_per_concours')
        ]

    def __str__(self):
        return f"{self.question} "
    
class ExerciceContext(models.Model):
    context_text = models.TextField(blank=True, null=True)
    COLOR_CHOICES = [
        ('#FF6B6B', 'Red'),
        ('#4ECDC4', 'Teal'),
        ('#45B7D1', 'Blue'),
        ('#96CEB4', 'Green'),
        ('#FECA57', 'Yellow'),
        ('#FF9FF3', 'Pink'),
        ('#54A0FF', 'Light Blue'),
        ('#5F27CD', 'Purple'),
        ('#00D2D3', 'Cyan'),
        ('#FF9F43', 'Orange'),
        ('#10AC84', 'Dark Green'),
        ('#EE5A24', 'Dark Orange'),
        ('#0984E3', 'Dark Blue'),
        ('#6C5CE7', 'Light Purple'),
        ('#A29BFE', 'Lavender'),
        ('#FD79A8', 'Hot Pink'),
        ('#E17055', 'Coral'),
        ('#81ECEC', 'Light Cyan'),
        ('#74B9FF', 'Sky Blue'),
        ('#A0E7E5', 'Mint Green'),
    ]
    
    context_text = models.TextField(blank=True, null=True)
    hex_color = models.CharField(
        max_length=7, 
        choices=COLOR_CHOICES, 
        default='#FF6B6B',
        # unique=True,  # Temporarily commented out
        help_text="Hex color code for the exercise context"
    )
    
    def get_random_unused_color(self):
        """Get a random color that's not currently used by other contexts"""
        used_colors = ExerciceContext.objects.exclude(id=self.id).values_list('hex_color', flat=True)
        available_colors = [color[0] for color in self.COLOR_CHOICES if color[0] not in used_colors]
        
        if available_colors:
            return random.choice(available_colors)
        else:
            # If all colors are used, raise an exception
            raise ValueError("All colors are already in use. Cannot assign a unique color.")
    
    def save(self, *args, **kwargs):
        if not self.hex_color or (not self.pk and self.hex_color == '#FF6B6B'):  # If new instance or default color
            self.hex_color = self.get_random_unused_color()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Context: {self.context_text[:60] if self.context_text else 'Empty'}"

class ExerciceContextImage(models.Model):
    exercice_context = models.ForeignKey(ExerciceContext,on_delete=models.CASCADE,related_name='images')
    image = models.ImageField(upload_to='exercice_context_images/')

    def __str__(self):
        return f"Image for Context ID {self.exercice_context.id}"

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