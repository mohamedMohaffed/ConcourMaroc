from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserAnswer, Question, Choice,Score,Concours
# from .serializers import UserAnswerCreateSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from datetime import timedelta
from .serializers import QuestionSerializer
from pprint import pprint



class UserAnswerScoreAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        concour_id = request.data.get("concour_id")
        answers = request.data.get("answers")
        time_spent = request.data.get("time_spent")
        type = request.data.get("type")

        # Check all required fields
        missing_fields = []
        if not concour_id:
            missing_fields.append("concour_id")
        if not answers:
            missing_fields.append("answers")
        if not time_spent:
            missing_fields.append("time_spent")
        if not type:
            missing_fields.append("type")
        try:
            user = User.objects.get(id=1)
        except User.DoesNotExist:
            missing_fields.append("user")

        if missing_fields:
            return Response(
                {"detail": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if isinstance(time_spent, str):
            # Expecting format "HH:MM:SS"
            h, m, s = map(int, time_spent.split(":"))
            time_spent_td = timedelta(hours=h, minutes=m, seconds=s)
        else:
            time_spent_td = timedelta(seconds=0)
        

        score_obj = Score.objects.create(
            user=user,
            concours_id=concour_id,
            score=0,  # will update after loop
            time_spent=time_spent_td,
            type=type 
        )
        score_value = 0
        serializer_errors = []

        # Check for None in any question or choice before proceeding
        for ans in answers:
            if ans.get("question") is None or ans.get("choice") is None:
                return Response(
                    {"detail": "Invalid question or choice: None value found."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        question_ids = [ans.get("question") for ans in answers]
        choice_ids = [ans.get("choice") for ans in answers]
        choices_qs = Choice.objects.filter(question_id__in=question_ids, id__in=choice_ids)
        choices_lookup = {(c.question_id, c.id): c for c in choices_qs}

        user_answer_objs = []
        for ans in answers:
            question_id = ans.get("question")
            choice_id = ans.get("choice")
            # Validate choice exists for question
            choice = choices_lookup.get((question_id, choice_id))
            if not choice:
                return Response(
                    {"detail": "Choice does not exist for this question."},
                    status=status.HTTP_404_NOT_FOUND
                )
            # Prepare UserAnswer instance (not saved yet)
            user_answer_objs.append(UserAnswer(
                user=user,
                concours_id=concour_id,
                question_id=question_id,
                choice_id=choice_id,
                score=score_obj
            ))
            if choice.is_correct:
                score_value += 1

        # Bulk create all UserAnswer objects
        try:
            UserAnswer.objects.bulk_create(user_answer_objs)
        except Exception as e:
            UserAnswer.objects.filter(score=score_obj).delete()
            score_obj.delete()
            return Response(
                {"detail": "Some answers could not be saved.", "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        score_obj.score = score_value
        score_obj.save()

        return Response(
            {"detail": "All answers saved successfully."},
            status=status.HTTP_201_CREATED
        )

class AllQuestionIncorrectAnswersUser(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, concour_slug):
        user_id = 1 # Default to 1 for testing
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            concours = Concours.objects.get(slug=concour_slug)
        except Concours.DoesNotExist:
            return Response(
                {"detail": "Concours not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        incorrect_questions_ids = UserAnswer.objects.filter(
            user=user, 
            choice__is_correct=False,
            concours=concours,
        ).values_list('question_id', flat=True).distinct()
        
        questions = Question.objects.filter(
            id__in=incorrect_questions_ids
        ).prefetch_related('choices')
        pprint(questions)
      
        serializer = QuestionSerializer(
            questions, 
            many=True,
            context={
                'show_is_correct': True,  
                'show_explanation': True 
            }
        )
        
        return Response(serializer.data, status=status.HTTP_200_OK)