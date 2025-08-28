from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserAnswer, Question, Choice,Score
from .serializers import UserAnswerCreateSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from datetime import timedelta



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
        for ans in answers:
            question_id = ans.get("question")
            choice_id = ans.get("choice")
            
            # Fix: allow 0 as valid ID, only None is invalid
            if question_id is None or choice_id is None:
                return Response(
                    {"detail": "Invalid question or choice."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            data = {
                "user": user.id,
                "concours": concour_id,
                "question": question_id,
                "choice": choice_id,
                "score": score_obj.id
            }

            serializer = UserAnswerCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                serializer_errors.append(serializer.errors)
                continue  # skip to next answer

            try:
                choice = Choice.objects.get(id=choice_id, question_id=question_id)
            except Choice.DoesNotExist:
                return Response(
                    {"detail": "Choice does not exist for this question."},
                    status=status.HTTP_404_NOT_FOUND
                )
            if choice.is_correct:
                score_value += 1

        if serializer_errors:
            return Response(
                {"detail": "Some answers could not be saved.", "errors": serializer_errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        score_obj.score = score_value
        score_obj.save()

        return Response(
            {"detail": "All answers saved successfully."},
            status=status.HTTP_201_CREATED
        )






