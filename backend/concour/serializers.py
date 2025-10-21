from rest_framework import serializers
from .models import (Level,University,Year,Subject,
                    Concours,Choice,Question,UserAnswer,Score,ExerciceContext)

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = '__all__'

class UniversitySerializer(serializers.ModelSerializer):
    level = LevelSerializer(read_only=True) 
    class Meta:
        model=University
        fields = '__all__'

class YearSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    class Meta:
        model = Year
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    year = YearSerializer(read_only=True)
    class Meta:
        model = Subject
        fields = '__all__'

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class ExerciceContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciceContext
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    exercice_context = ExerciceContextSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'explanation', 'choices', 'exercice_context', 'created_at']

class ConcourSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Concours
        fields = '__all__'

    def get_questions(self, obj):    
        return QuestionSerializer(
            obj.questions.all(),
            many=True,
        ).data




####

class UserAnswerCreateSerializer(serializers.ModelSerializer):
    correct_choice = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = ['id', 'user', 'question', 'user_choice', 'concours', 'created_at', 'score', 'correct_choice']

    def get_correct_choice(self, obj):
        correct_choice = obj.question.choices.filter(is_correct=True).first()
        return correct_choice.id if correct_choice else None

class UserAnserList(serializers.ModelSerializer):
    class Meta:
        # model=UserAnswer
        # fieleds=
        pass

class ConcoursListSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source='subject.name')
    year = serializers.IntegerField(source='subject.year.year')
    university = serializers.CharField(source='subject.year.university.name')
    level = serializers.CharField(source='subject.year.university.level.name')
    concours_id = serializers.IntegerField(source='id')
    concours_slug = serializers.CharField(source='slug')

    class Meta:
        model = Concours
        fields = ['subject', 'year', 'university', 'level', 'concours_id', 'concours_slug']
        fields = ['subject', 'year', 'university', 'level', 'concours_id', 'concours_slug']

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

class AllScoresSerializer(serializers.ModelSerializer):
    concours = ConcourSerializer(read_only=True)
    
    class Meta:
        model = Score
        fields = '__all__'

