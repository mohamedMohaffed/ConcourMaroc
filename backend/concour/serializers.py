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




class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        show_is_correct = self.context.get('show_is_correct', True)
        if not show_is_correct:
            rep.pop('is_correct', None)
        return rep

class QuestionSerializer(serializers.ModelSerializer):
    choices = serializers.SerializerMethodField()
    explanation = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'text', 'explanation', 'choices']

    def get_choices(self, obj):
        show_is_correct = self.context.get('show_is_correct', True)
        return ChoiceSerializer(obj.choices.all(), many=True, context={'show_is_correct': show_is_correct}).data

    def get_explanation(self, obj):
        show_explanation = self.context.get('show_explanation', True)
        return obj.explanation if show_explanation else None

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        show_explanation = self.context.get('show_explanation', True)
        if not show_explanation:
            rep.pop('explanation', None)
        return rep

class ConcourSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Concours
        fields = '__all__'

    def get_questions(self, obj):
        show_is_correct = self.context.get('show_is_correct', True)
        show_explanation = self.context.get('show_explanation', True)
        
        return QuestionSerializer(
            obj.questions.all(),
            many=True,
            context={
                'show_is_correct': show_is_correct,
                'show_explanation': show_explanation
            }
        ).data



