from django.urls import path
from .views_users import (
    CreateUserView,
    UpdateCurrentPlanView,
    UpdatePasswordView,
    PasswordResetView,
)
from .views_user import LoginView, ValidationView

urlpatterns = [
    # Users
    path("users/", CreateUserView.as_view()),
    path("users/update/currentplan/", UpdateCurrentPlanView.as_view()),
    path("users/update/password/", UpdatePasswordView.as_view()),
    path("users/passwordreset/", PasswordResetView.as_view()),

    # Auth
    path("user/login/", LoginView.as_view()),
    path("user/validation/", ValidationView.as_view()),
]