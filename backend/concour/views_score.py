from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserAnswer, Question, Choice
from .serializers import UserAnswerCreateSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from django.contrib.auth.models import User

class UserAnswerAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        concour_id = request.data.get("concour_id")
        answers = request.data.get("answers", [])
        # user = request.user
        user= User.objects.get(id=1)


        if not concour_id or not answers:
            return Response({"detail": "concour_id and answers are required."}, 
                            status=status.HTTP_400_BAD_REQUEST)

        created_answers = []
        for ans in answers:
            question_id = ans.get("question")
            choice_id = ans.get("choice")
            if not question_id or not choice_id:
                continue  # skip invalid answer

            data = {
                "user": user.id,
                "concours": concour_id,  
                "question": question_id,
                "choice": choice_id
            }
            serializer = UserAnswerCreateSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                created_answers.append(serializer.data)
            else:
                # Optionally, collect errors per answer
                continue

        return Response({"created": created_answers}, status=status.HTTP_201_CREATED)
