from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserAnswer, Question, Choice,Score,Concours
# from .serializers import UserAnswerCreateSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from datetime import timedelta
from .serializers import (QuestionSerializer, ConcoursListSerializer,
                           UserAnswerCreateSerializer, ScoreSerializer)
# from pprint import pprint

class UserAnswerScoreAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        concour_id = request.data.get("concour_id")
        answers = request.data.get("answers")
        time_spent = request.data.get("time_spent")

        # Check all required fields
        missing_fields = []
        if not concour_id:
            missing_fields.append("concour_id")
        if not answers:
            missing_fields.append("answers")
        if not time_spent:
            missing_fields.append("time_spent")
        # if not type:
        #     missing_fields.append("type")
            
        user = request.user
        if user.is_anonymous:
            missing_fields.append("user")

        if missing_fields:
            return Response(
                {"detail": f"Missing required fields: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if isinstance(time_spent, str):
            # Expecting format "HH:MM:SS"
            try:
                h, m, s = map(int, time_spent.split(":"))
                time_spent_td = timedelta(hours=h, minutes=m, seconds=s)
            except Exception:
                time_spent_td = timedelta(seconds=0)
        elif isinstance(time_spent, int):
            time_spent_td = timedelta(seconds=time_spent)
        else:
            time_spent_td = timedelta(seconds=0)
        

        score_obj = Score.objects.create(
            user=user,
            concours_id=concour_id,
            score=0,  # will update after loop
            time_spent=time_spent_td,
            # type=type 
        )
        score_value = 0
        serializer_errors = []

        # Check for None in any question or choice before proceeding
        for ans in answers:
            if ans.get("question_id") is None or ans.get("choice_id") is None:
                return Response(
                    {"detail": "Invalid question_id or choice_id: None value found."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        question_ids = [ans.get("question_id") for ans in answers]
        choice_ids = [ans.get("choice_id") for ans in answers]
        choices_qs = Choice.objects.filter(question_id__in=question_ids, id__in=choice_ids)
        choices_lookup = {(c.question_id, c.id): c for c in choices_qs}

        user_answer_objs = []
        for ans in answers:
            question_id = ans.get("question_id")
            choice_id = ans.get("choice_id")
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
                user_choice=choice,  # <-- FIXED: was choice_id=choice_id
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
class IncorrectAnswersListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = 1  # Replace with request.user.id in production
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        concours_ids = UserAnswer.objects.filter(
            user=user,
            choice__is_correct=False
        ).values_list('concours_id', flat=True).distinct()

        concours_qs = Concours.objects.filter(id__in=concours_ids).select_related(
            'subject__year__university__level',
            'subject__year__university',
            'subject__year',
            'subject'
        )

        serializer = ConcoursListSerializer(concours_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class QuestionIncorrectAnswersUserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
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
      
        serializer = QuestionSerializer(
            questions, 
            many=True,
            context={
                'show_is_correct': True,  
                'show_explanation': True 
            }
        )
        
        return Response(serializer.data, status=status.HTTP_200_OK)
class LastUserScoreAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, concour_id):
        user = request.user

        last_score = Score.objects.select_related(
            'concours__subject__year__university__level',
            'concours__subject__year__university',
            'concours__subject__year',
            'concours__subject',
            'concours'
        ).filter(user=user, concours_id=concour_id).order_by('-created_at').first()

        if not last_score:
            return Response({"detail": "No score found for user."}, status=status.HTTP_404_NOT_FOUND)

        user_answers = UserAnswer.objects.filter(score=last_score).select_related(
            'question', 'user_choice', 'concours'
        ).prefetch_related('question__choices')

        concours = last_score.concours if last_score else None
        subject = concours.subject if concours and hasattr(concours, 'subject') else None
        year = subject.year if subject and hasattr(subject, 'year') else None
        university = year.university if year and hasattr(year, 'university') else None
        level = university.level if university and hasattr(university, 'level') else None

        score_data = {
            "score": last_score.score,
            "time_spent": last_score.time_spent,
            "lenght_question": last_score.concours.questions.count() if last_score.concours else 0,
            "concours_id": concours.id if concours else None,
            "created_at": last_score.created_at,
            "slug_level": level.slug if level else None,
            "slug_university": university.slug if university else None,
            "slug_year": year.slug if year else None,
            "slug_subject": subject.slug if subject else None,
        }
        user_answers_data = UserAnswerCreateSerializer(user_answers, many=True).data

        return Response(
            {
                "score": score_data,
                "user_answers": user_answers_data,
            },
            status=status.HTTP_200_OK
        )
class DeleteLastScoreAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, concour_id):
        user = request.user
        last_score = Score.objects.filter(user=user, concours_id=concour_id).order_by('-created_at').first()
        if not last_score:
            return Response({"detail": "No score found for user."}, status=status.HTTP_404_NOT_FOUND)
        last_score.delete()
        return Response({"detail": "Last score deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
class AllScoresForConcourAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, concour_id):
        user = request.user
        scores = (
            Score.objects
            .filter(concours_id=concour_id, user=user)
            .select_related(
                'user',
                'concours',
                'concours__subject',
                'concours__subject__year',
                'concours__subject__year__university',
                'concours__subject__year__university__level'
            )
            .prefetch_related(
                'user_answers_score',
                'user_answers_score__question',
                'user_answers_score__question__choices',
                'user_answers_score__user_choice'
            )
        )
        serializer = ScoreSerializer(scores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

