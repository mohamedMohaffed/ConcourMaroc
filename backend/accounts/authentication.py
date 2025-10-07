from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        
        if not access_token:
            print("🔍 No access token found in cookies")
            return None  
            
        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            # print(f"✅ Successfully authenticated user: {user.username}")
            return (user, validated_token)
        except Exception as e:
            # print(f"❌ Token validation failed auth: {e}")
            return None
