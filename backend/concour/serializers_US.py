from rest_framework import serializers
from .models import (Concours,UserAnswer,Score)
from .serializers import ConcourSerializer


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
