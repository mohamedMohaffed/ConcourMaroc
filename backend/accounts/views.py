from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print(f"Login attempt for user: {username}")
        user = authenticate(username=username, password=password)
        
        if user is not None:
            print(f"Login successful for user: {username}")
            refresh = RefreshToken.for_user(user)
            
            response = Response({'detail': 'Login successful'})
            
            # Set cookies
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                samesite='Lax'
            )
            response.set_cookie(
                'refresh_token',
                str(refresh),
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                samesite='Lax'
            )
            
            return response
            
        print(f"Login failed for user: {username}")
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        print("User logged out")
        response = Response({'detail': 'Successfully logged out'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class RefreshTokenView(APIView):
    def post(self, request):
        print("Token refresh attempt")
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            print("No refresh token found in cookies")
            return Response({'detail': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            refresh = RefreshToken(refresh_token)
            print("Token refresh successful - generating new access token")
            response = Response({'detail': 'Token refreshed successfully'})
            
            # Set new access token cookie
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                samesite='Lax'
            )
            
            return response
        except Exception as e:
            print(f"Token refresh failed with error: {str(e)}")
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'detail': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        return Response({'detail': 'User registered successfully'}, 
                        status=status.HTTP_201_CREATED)
    
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })
