"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
import os

# Catch-all view that serves index.html for React Router
class FrontendView(TemplateView):
    def get(self, request, *args, **kwargs):
        from django.http import HttpResponse
        index_path = os.path.join(settings.FRONTEND_DIR, "index.html")
        try:
            with open(index_path, "r", encoding="utf-8") as f:
                return HttpResponse(f.read(), content_type="text/html")
        except FileNotFoundError:
            from django.http import HttpResponseNotFound
            return HttpResponseNotFound("Frontend not built yet. Run: npm run build")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v0/", include("api.urls")),
    re_path(r"^.*$", FrontendView.as_view()),  # catch-all — must be last
]