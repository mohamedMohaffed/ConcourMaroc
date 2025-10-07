from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError



class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # print(request.COOKIES)

        if response.status_code == status.HTTP_200_OK:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            # print(refresh_token)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,  
                samesite='Lax',  
                secure=False,    
                expires=datetime.now() + timedelta(minutes=5)
            )
            
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                samesite='Lax',
                secure=False,
                expires=datetime.now() + timedelta(days=7)
            )
            
            response.data = {'detail': 'Authentication successful'}
        
        return response



class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        # print(request.COOKIES)
        if not refresh_token:
            # print("❌ No refresh token found in cookies")
            return Response({'detail': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            refresh = RefreshToken(refresh_token)
            
            access_token = str(refresh.access_token)
            
            # print("✅ Token refreshed successfully on backend")
            
            response = Response({'detail': 'Token refreshed successfully'})
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True, 
                samesite='Lax',
                secure=False, 
                expires=datetime.now() + timedelta(minutes=5)
            )
            
            return response
        
        except TokenError as e:
            # print(f"❌ Token refresh failed: {e}")
            response = Response({'detail': 'Veuillez vous connecter'}, status=440)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            # print(f"\033[34m{response}\033[0m")
            return response


        



class LogoutView(APIView):
    def post(self, request):
        response = Response({'detail': 'Successfully logged out'})
        
        response.delete_cookie('access_token')
        
        response.delete_cookie('refresh_token')
        
        return response




















# i have a prblem the code dont enter here catch (refreshError) {
#                 processQueue(refreshError);
#                 isRefreshing = false;
#                 console.log("im working")
                
                
#                 // Redirect to login page
#                 window.location.href = '/login';
                
#                 // return Promise.reject(refreshError);
#             }/////