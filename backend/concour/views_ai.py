# backend/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from rest_framework.permissions import IsAuthenticated

API_KEY = "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"
BASE_URL = "https://api.groq.com/openai/v1"
MODEL = "openai/gpt-oss-20b"

class AIResponderAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_prompt = request.data.get("prompt")
        if not user_prompt:
            return Response({"error": "Missing 'prompt' in request."}, status=status.HTTP_400_BAD_REQUEST)
        
        client = OpenAI(api_key=API_KEY, base_url=BASE_URL)

        try:
            response = client.responses.create(
                model=MODEL,
                input=user_prompt  # Changed 'prompt' to 'input'
            )
            return Response({"output": response.output_text})
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


