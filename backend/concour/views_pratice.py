
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

        # Get IDs of questions the user answered incorrectly
        incorrect_question_ids = UserAnswer.objects.filter(
            user=user,
            user_choice__is_correct=False,
            concours=concours
        ).values_list('question_id', flat=True).distinct()

        # Filter only incorrect questions (DO NOT modify concours.questions)
        incorrect_questions = concours.questions.filter(id__in=incorrect_question_ids)

        # Serialize concours but replace 'questions' with only incorrect ones
        concours_data = ConcourSerializer(concours).data
        concours_data['questions'] = QuestionSerializer(incorrect_questions, many=True).data

        return Response(concours_data, status=status.HTTP_200_OK)
    