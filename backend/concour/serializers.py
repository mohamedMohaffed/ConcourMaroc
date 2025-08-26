from rest_framework import serializers
from .models import Level,University,Year,Subject,Concours,Choice,Question

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

class ConcourSerializer(serializers.ModelSerializer):
    subject=SubjectSerializer(read_only=True)
    class Meta:
        model = Concours
        fields = '__all__'

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'explanation', 'choices', 'course_parts']

# UPDATE your existing ConcourSerializer to:
class ConcourSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)  # Add this line
    
    class Meta:
        model = Concours
        fields = '__all__'        