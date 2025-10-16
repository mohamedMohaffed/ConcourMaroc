from django.urls import path
from .views import LoginView, RefreshTokenView, LogoutView, RegisterView
from .views import CurrentUserView

urlpatterns = [
    path('api/token/', LoginView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/current_user/', CurrentUserView.as_view(), name='current_user'),
]
