from rest_framework import serializers
from .models import (Concours,UserAnswer,Score)


class UserAnswerCreateSerializer(serializers.ModelSerializer):
    correct_choice = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = ['id', 'user', 'question', 'user_choice', 'concours','score', 'correct_choice']

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
    concours_id = serializers.IntegerField(source='id')
    concours_slug = serializers.CharField(source='slug')

    class Meta:
        model = Concours
        fields = ['subject', 'year', 'university','concours_id', 'concours_slug']

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

class ConcoursDashboardSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source='subject.name', read_only=True)
    year = serializers.IntegerField(source='subject.year.year', read_only=True)
    university = serializers.CharField(source='subject.year.university.name', read_only=True)

    class Meta:
        model = Concours
        fields = ['subject', 'year', 'university']

class AllScoresSerializer(serializers.ModelSerializer):
    concours = ConcoursDashboardSerializer(read_only=True)

    class Meta:
        model = Score
        fields = ['id', 'score', 'time_spent', 'created_at', 'concours']
