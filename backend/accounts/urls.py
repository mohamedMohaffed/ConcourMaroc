from django.urls import path
from .views import LoginView, RefreshTokenView, LogoutView

urlpatterns = [
path('api/token/', LoginView.as_view(), name='token_obtain_pair'),
path('api/token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
path('api/logout/', LogoutView.as_view(), name='logout'),
]
