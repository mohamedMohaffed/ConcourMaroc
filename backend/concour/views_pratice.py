from rest_framework.views import APIView
from rest_framework.response import Response

# from .serializers import UserAnswerCreateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import (UserAnswer,Concours)
from .serializers import ConcoursListSerializer,ConcourSerializer,QuestionSerializer


class IncorrectAnswersListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # We already have the authenticated user

        concours_ids = UserAnswer.objects.filter(
            user=user,
            user_choice__is_correct=False  # Changed from choice__is_correct to user_choice__is_correct
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
        user = request.user

        try:
            concours = Concours.objects.get(slug=concour_slug)
        except Concours.DoesNotExist:
            return Response(
                {"detail": "Concours not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get UserAnswer objects for incorrect answers
        incorrect_user_answers = UserAnswer.objects.filter(
            user=user,
            user_choice__is_correct=False,
            concours=concours
        )

        # Map question_id to incorrect_answer_count
        incorrect_counts = {
            ua.question_id: ua.incorrect_answer_count
            for ua in incorrect_user_answers
        }

        # Get IDs of questions the user answered incorrectly
        incorrect_question_ids = incorrect_counts.keys()

        # Filter only incorrect questions (DO NOT modify concours.questions)
        incorrect_questions = concours.questions.filter(id__in=incorrect_question_ids)

        # Serialize concours but replace 'questions' with only incorrect ones
        concours_data = ConcourSerializer(concours).data
        questions_data = QuestionSerializer(incorrect_questions, many=True).data

        # Add incorrect_answer_count to each question
        for q in questions_data:
            q['incorrect_answer_count'] = incorrect_counts.get(q['id'], 0)

        concours_data['questions'] = questions_data

        return Response(concours_data, status=status.HTTP_200_OK)

class DeleteCorrectAnswersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, concour_id):
        user = request.user
        correct_answers = request.data.get('correct_answers', [])

        if not correct_answers:
            return Response(
                {"detail": "No correct answers provided to delete."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            concours = Concours.objects.get(id=concour_id)
        except Concours.DoesNotExist:
            return Response(
                {"detail": "Concours not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Extract question_ids from correct_answers
        question_ids = [ans.get('question_id') for ans in correct_answers if ans.get('question_id')]
        
        if not question_ids:
            return Response(
                {"detail": "No valid question IDs provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete user answers for the provided correct answer question IDs
        deleted_count, _ = UserAnswer.objects.filter(
            user=user,
            concours=concours,
            question_id__in=question_ids
        ).delete()

        return Response(
            {
                "detail": f"Successfully deleted {deleted_count} correct answers.",
                "deleted_count": deleted_count
            },
            status=status.HTTP_200_OK
        )
