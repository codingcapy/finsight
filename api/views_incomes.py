from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Income, Plan
from .views_plans import get_request_user, serialize_plan
from .views_users import parse_body


def serialize_income(income: Income) -> dict:
    return {
        "incomeId": income.income_id,
        "planId": income.plan_id,
        "company": income.company,
        "position": income.position,
        "amount": income.amount,
        "tax": income.tax,
        "status": income.status,
        "createdAt": income.created_at.isoformat(),
    }


def check_plan_ownership(user, plan_id) -> Plan | None:
    """Returns the plan if it belongs to the user, else None."""
    try:
        return Plan.objects.get(plan_id=plan_id, user=user)
    except Plan.DoesNotExist:
        return None


@method_decorator(csrf_exempt, name="dispatch")
class IncomesView(View):

    def post(self, request):
        """POST /api/v0/incomes/ — create an income"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        company = body.get("company", "")
        position = body.get("position", "")
        amount = body.get("amount", 0)
        tax = body.get("tax", 0)

        if plan_id is None:
            return JsonResponse({"message": "planId is required"}, status=400)

        if not check_plan_ownership(user, plan_id):
            return JsonResponse({"message": "Unauthorized"}, status=401)

        income = Income.objects.create(
            plan_id=plan_id,
            company=company,
            position=position,
            amount=amount,
            tax=tax,
        )
        return JsonResponse({"plan": serialize_income(income)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class IncomesByPlanView(View):

    def get(self, request, plan_id):
        """GET /api/v0/incomes/<plan_id>/ — get all incomes for a plan"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        if not check_plan_ownership(user, plan_id):
            return JsonResponse({"message": "Unauthorized"}, status=401)

        incomes = Income.objects.filter(plan_id=plan_id)
        return JsonResponse({"incomes": [serialize_income(i) for i in incomes]}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DeleteIncomeView(View):

    def post(self, request):
        """POST /api/v0/incomes/delete/ — delete an income"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        income_id = body.get("incomeId")

        if income_id is None:
            return JsonResponse({"message": "incomeId is required"}, status=400)

        # Ownership check via join (income -> plan -> user)
        try:
            income = Income.objects.select_related("plan").get(
                income_id=income_id,
                plan__user=user
            )
        except Income.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        income.delete()
        return JsonResponse({"income": serialize_income(income)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdateIncomeView(View):

    def post(self, request):
        """POST /api/v0/incomes/update/ — update an income"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        income_id = body.get("incomeId")

        if income_id is None:
            return JsonResponse({"message": "incomeId is required"}, status=400)

        # Ownership check via join (income -> plan -> user)
        try:
            income = Income.objects.select_related("plan").get(
                income_id=income_id,
                plan__user=user
            )
        except Income.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        # Only update fields that were actually sent
        if "company" in body:
            income.company = body["company"]
        if "position" in body:
            income.position = body["position"]
        if "amount" in body:
            income.amount = body["amount"]
        if "tax" in body:
            income.tax = body["tax"]

        income.save()
        return JsonResponse({"income": serialize_income(income)}, status=200)