# file: middleware.py
from rest_framework.response import Response
from rest_framework import status

class ClearAuthCookiesMiddleware:
    """
    Middleware to clear authentication cookies if authentication fails
    or refresh token has expired.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if getattr(request, "_delete_auth_cookies", False):
            # If the view returned a response, we modify it.
            # This is the common case for token refresh failures.
            if hasattr(response, 'delete_cookie'):
                response.delete_cookie("access_token")
                response.delete_cookie("refresh_token")
                print("🗑️ Deleted access_token and refresh_token cookies from existing response")
            else:
                # This is a fallback for cases where the response might not be a DRF Response.
                response = Response(
                    {'detail': 'Authentication credentials were not provided or are invalid.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
                response.delete_cookie("access_token")
                response.delete_cookie("refresh_token")
                print("🗑️ Deleted access_token and refresh_token cookies and created new response")

        return response
