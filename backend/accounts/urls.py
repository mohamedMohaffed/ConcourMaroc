from django.urls import path
from .views import (
    LoginView, RefreshTokenView, LogoutView, RegisterView,
    CurrentUserView, PasswordResetRequestView, PasswordResetConfirmView,
    VerifyEmailView
)

urlpatterns = [
    path('api/token/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),

    path('api/current_user/', CurrentUserView.as_view(), name='current_user'),

    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('api/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    path('api/verify-email/', VerifyEmailView.as_view(), name='verify_email'),
]
