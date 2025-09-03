# file: middleware.py

class ClearAuthCookiesMiddleware:
    """
    Middleware to clear authentication cookies if authentication fails
    or refresh token has expired.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # نفذ الـ view أو الكود التالي
        response = self.get_response(request)

        # تحقق من العلامة _delete_auth_cookies
        if getattr(request, "_delete_auth_cookies", False):
            # مسح الكوكيز
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            print("🗑️ Deleted access_token and refresh_token cookies")

        return response
