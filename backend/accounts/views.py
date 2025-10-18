from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse

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
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Validation
        errors = {}
        if not username:
            errors['username'] = 'Username is required'
        if not email:
            errors['email'] = 'Email is required'
        if not password:
            errors['password'] = 'Password is required'
            
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # Check if username exists
            if User.objects.filter(username=username).exists():
                errors['username'] = 'Username already exists'
                
            # Check if email exists
            # if User.objects.filter(email=email).exists():
            #     errors['email'] = 'Email already exists'
                
            if errors:
                return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

            # Create inactive user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_active=False
            )

            # Generate verification token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verification_link = f"http://localhost:5173/verify-email/{uid}/{token}"

            # Send verification email
            try:
                send_mail(
                    'Verify your email',
                    f'Please click the following link to verify your email: {verification_link}',
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Email sending failed: {str(e)}")
                user.delete()  # Rollback user creation if email fails
                return Response(
                    {'detail': 'Registration failed due to email service error'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response(
                {'detail': 'User registered successfully. Please check your email to verify your account.'}, 
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return Response(
                {'detail': 'Registration failed due to server error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.is_staff = True  # Set user as staff when email is verified
                user.save()
                return Response({'detail': 'Email verified successfully'})
            return Response(
                {'detail': 'Invalid verification token'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Email verification failed: {str(e)}")  # Add logging
            return Response(
                {'detail': 'Email verification failed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
            
            send_mail(
                'Password Reset Request',
                f'Click the following link to reset your password: {reset_link}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({'detail': 'Password reset email sent'})
        except User.DoesNotExist:
            return Response({'detail': 'User with this email does not exist'}, 
                          status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({'detail': 'Password reset successful'})
            return Response({'detail': 'Invalid token'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'Password reset failed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
