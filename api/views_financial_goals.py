from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils.dateparse import parse_datetime

from .models import FinancialGoal, Plan
from .views_plans import get_request_user
from .views_users import parse_body

from .helpers import check_plan_item_limit

def serialize_financial_goal(goal: FinancialGoal) -> dict:
    return {
        "financialGoalId": goal.financial_goal_id,
        "planId": goal.plan_id,
        "name": goal.name,
        "amount": goal.amount,
        "targetDate": goal.target_date.isoformat(),
        "createdAt": goal.created_at.isoformat(),
    }


@method_decorator(csrf_exempt, name="dispatch")
class FinancialGoalsView(View):

    def post(self, request):
        """POST /api/v0/financialgoals/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        target_date_str = body.get("targetDate")

        if plan_id is None:
            return JsonResponse({"message": "planId is required"}, status=400)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        target_date = parse_datetime(target_date_str) if target_date_str else None
        if not target_date:
            return JsonResponse({"message": "Invalid or missing targetDate (use ISO format)"}, status=400)
        
        if not check_plan_item_limit(plan_id, FinancialGoal):
            return JsonResponse({"message": "..."}, status=400)

        goal = FinancialGoal.objects.create(
            plan_id=plan_id,
            name=body.get("name", ""),
            amount=body.get("amount", 0),
            target_date=target_date,
        )
        return JsonResponse({"financialGoal": serialize_financial_goal(goal)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class FinancialGoalsByPlanView(View):

    def get(self, request, plan_id):
        """GET /api/v0/financialgoals/<plan_id>/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        goals = FinancialGoal.objects.filter(plan_id=plan_id)
        return JsonResponse({"financialGoals": [serialize_financial_goal(g) for g in goals]}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DeleteFinancialGoalView(View):

    def post(self, request):
        """POST /api/v0/financialgoals/delete/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        goal_id = body.get("financialGoalId")

        if goal_id is None:
            return JsonResponse({"message": "financialGoalId is required"}, status=400)

        try:
            goal = FinancialGoal.objects.select_related("plan").get(
                financial_goal_id=goal_id, plan__user=user
            )
        except FinancialGoal.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        goal.delete()
        return JsonResponse({"financialGoal": serialize_financial_goal(goal)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdateFinancialGoalView(View):

    def post(self, request):
        """POST /api/v0/financialgoals/update/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        goal_id = body.get("financialGoalId")

        if goal_id is None:
            return JsonResponse({"message": "financialGoalId is required"}, status=400)

        try:
            goal = FinancialGoal.objects.select_related("plan").get(
                financial_goal_id=goal_id, plan__user=user
            )
        except FinancialGoal.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        if "name" in body:
            goal.name = body["name"]
        if "amount" in body:
            goal.amount = body["amount"]
        if "targetDate" in body:
            parsed = parse_datetime(body["targetDate"])
            if parsed:
                goal.target_date = parsed

        goal.save()
        return JsonResponse({"financialGoal": serialize_financial_goal(goal)}, status=200)