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
from .views_incomes import (
    IncomesView,
    IncomesByPlanView,
    DeleteIncomeView,
    UpdateIncomeView,
)
from .views_expenditures import (
    ExpendituresView,
    ExpendituresByPlanView,
    DeleteExpenditureView,
    UpdateExpenditureView,
)
from .views_assets import (
    AssetsView,
    AssetsByPlanView,
    DeleteAssetView,
    UpdateAssetView,
)
from .views_liabilities import (
    LiabilitiesView,
    LiabilitiesByPlanView,
    DeleteLiabilityView,
    UpdateLiabilityView,
)
from .views_financial_goals import (
    FinancialGoalsView,
    FinancialGoalsByPlanView,
    DeleteFinancialGoalView,
    UpdateFinancialGoalView,
)
from .views_generations import (
    GenerationsByPlanView,
    DeleteGenerationView,
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

    # Incomes
    path("incomes/", IncomesView.as_view()),
    path("incomes/<int:plan_id>/", IncomesByPlanView.as_view()),
    path("incomes/delete/", DeleteIncomeView.as_view()),
    path("incomes/update/", UpdateIncomeView.as_view()),

    # Expenditures
    path("expenditures/", ExpendituresView.as_view()),
    path("expenditures/<int:plan_id>/", ExpendituresByPlanView.as_view()),
    path("expenditures/delete/", DeleteExpenditureView.as_view()),
    path("expenditures/update/", UpdateExpenditureView.as_view()),

    # Assets
    path("assets/", AssetsView.as_view()),
    path("assets/<int:plan_id>/", AssetsByPlanView.as_view()),
    path("assets/delete/", DeleteAssetView.as_view()),
    path("assets/update/", UpdateAssetView.as_view()),

    # Liabilities
    path("liabilities/", LiabilitiesView.as_view()),
    path("liabilities/<int:plan_id>/", LiabilitiesByPlanView.as_view()),
    path("liabilities/delete/", DeleteLiabilityView.as_view()),
    path("liabilities/update/", UpdateLiabilityView.as_view()),

    # Financial Goals
    path("financialgoals/", FinancialGoalsView.as_view()),
    path("financialgoals/<int:plan_id>/", FinancialGoalsByPlanView.as_view()),
    path("financialgoals/delete/", DeleteFinancialGoalView.as_view()),
    path("financialgoals/update/", UpdateFinancialGoalView.as_view()),

    # Generations
    path("generations/<int:plan_id>/", GenerationsByPlanView.as_view()),
    path("generations/delete/", DeleteGenerationView.as_view()),
]