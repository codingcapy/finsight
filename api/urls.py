from django.urls import path
from .views_users import (
    CreateUserView,
    UpdateCurrentPlanView,
    UpdatePasswordView,
    PasswordResetView,
)
from .views_user import LoginView, ValidationView
from .views_plans import (
    PlansView,
    PlanDetailView,
    DeletePlanView,
    UpdatePlanTitleView,
    UpdatePlanCurrencyView,
    UpdatePlanYearOfBirthView,
    UpdatePlanLocationView,
)

urlpatterns = [
    # Users
    path("users/", CreateUserView.as_view()),
    path("users/update/currentplan/", UpdateCurrentPlanView.as_view()),
    path("users/update/password/", UpdatePasswordView.as_view()),
    path("users/passwordreset/", PasswordResetView.as_view()),

    # Auth
    path("user/login/", LoginView.as_view()),
    path("user/validation/", ValidationView.as_view()),

    # Plans
    path("plans/", PlansView.as_view()),
    path("plans/<int:plan_id>/", PlanDetailView.as_view()),
    path("plans/delete/", DeletePlanView.as_view()),
    path("plans/update/", UpdatePlanTitleView.as_view()),
    path("plans/update/currency/", UpdatePlanCurrencyView.as_view()),
    path("plans/update/yearofbirth/", UpdatePlanYearOfBirthView.as_view()),
    path("plans/update/location/", UpdatePlanLocationView.as_view()),
]