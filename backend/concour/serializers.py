from rest_framework import serializers
from .models import (University,Year,Subject,Concours,Choice,Question,ExerciceContext, ExerciceContextImage)



class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model=University
        fields = ["id","name","slug"]

class YearSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    class Meta:
        model = Year
        fields = ['id', 'year', 'slug', 'university']  

class SubjectSerializer(serializers.ModelSerializer):
    year = YearSerializer(read_only=True)
    class Meta:
        model = Subject
        fields = ["id", "name", "slug", "year"]

#----Quiz---#

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class ExerciceContextImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciceContextImage
        fields = ['id', 'image']

class ExerciceContextSerializer(serializers.ModelSerializer):
    images = ExerciceContextImageSerializer(many=True, read_only=True)

    class Meta:
        model = ExerciceContext
        fields = ["id","context_text","images"]

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    exercice_context = ExerciceContextSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'explanation', 'choices', 'exercice_context']

class ConcourSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Concours
        fields = ['id', 'subject', 'questions','slug']

#---- END--Quiz---#

