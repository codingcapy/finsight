import os
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from dotenv import load_dotenv

load_dotenv()

from .models import Plan, User
from .views_users import serialize_user, parse_body
from .views_user import decode_token


# --- Helpers ---

def get_request_user(request) -> User | None:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header:
        return None
    parts = auth_header.split(" ")
    if len(parts) != 2:
        return None
    payload = decode_token(parts[1])
    if not payload:
        return None
    try:
        return User.objects.get(user_id=payload["id"])
    except User.DoesNotExist:
        return None


def serialize_plan(plan: Plan) -> dict:
    return {
        "planId": plan.plan_id,
        "userId": plan.user_id,
        "title": plan.title,
        "icon": plan.icon,
        "currency": plan.currency,
        "location": plan.location,
        "yearOfBirth": plan.year_of_birth,
        "status": plan.status,
        "createdAt": plan.created_at.isoformat(),
    }


# --- Views ---

@method_decorator(csrf_exempt, name="dispatch")
class PlansView(View):

    def post(self, request):
        """POST /api/v0/plans/ — create a plan"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        title = body.get("title", "").strip()

        if not title or len(title) > 80:
            return JsonResponse({"message": "Invalid title"}, status=400)

        if Plan.objects.filter(user=user).count() >= 20:
            return JsonResponse({"message": "Plan limit reached"}, status=400)

        plan = Plan.objects.create(user=user, title=title)

        # Update user's current plan to the newly created one
        user.current_plan = plan.plan_id
        user.save()

        return JsonResponse({"user": serialize_user(user)}, status=200)

    def get(self, request):
        """GET /api/v0/plans/ — get all plans for user"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        plans = Plan.objects.filter(user=user)
        return JsonResponse({"plans": [serialize_plan(p) for p in plans]}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class PlanDetailView(View):

    def get(self, request, plan_id):
        """GET /api/v0/plans/<plan_id>/ — get a single plan"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            plan = Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"plan": None}, status=200)

        return JsonResponse({"plan": serialize_plan(plan)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DeletePlanView(View):

    def post(self, request):
        """POST /api/v0/plans/delete/ — delete a plan"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")

        if plan_id is None:
            return JsonResponse({"message": "planId is required"}, status=400)

        # Ownership check
        try:
            plan = Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        plan.delete()

        # Check if user has any plans left
        remaining = Plan.objects.filter(user=user)
        if not remaining.exists():
            # Auto-create a new default plan if none left
            new_plan = Plan.objects.create(
                user=user,
                title=f"{user.username}'s plan"
            )
            user.current_plan = new_plan.plan_id
        else:
            user.current_plan = remaining.first().plan_id

        user.save()
        return JsonResponse({"user": serialize_user(user)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdatePlanTitleView(View):

    def post(self, request):
        """POST /api/v0/plans/update/ — update plan title"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        title = body.get("title", "").strip()

        if not title or len(title) > 80:
            return JsonResponse({"message": "Invalid title"}, status=400)

        try:
            plan = Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        plan.title = title
        plan.save()
        return JsonResponse({"plan": serialize_plan(plan)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdatePlanCurrencyView(View):

    def post(self, request):
        """POST /api/v0/plans/update/currency/ — update plan currency"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        currency = body.get("currency", "").strip()

        if not currency or len(currency) > 10:
            return JsonResponse({"message": "Invalid currency"}, status=400)

        try:
            plan = Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        plan.currency = currency
        plan.save()
        return JsonResponse({"plan": serialize_plan(plan)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdatePlanYearOfBirthView(View):

    def post(self, request):
        """POST /api/v0/plans/update/yearofbirth/ — update year of birth"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        year_of_birth = body.get("yearOfBirth", "").strip()

        if not year_of_birth:
            return JsonResponse({"message": "Invalid yearOfBirth"}, status=400)

        try:
            plan = Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        plan.year_of_birth = year_of_birth
        plan.save()
        return JsonResponse({"plan": serialize_plan(plan)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdatePlanLocationView(View):

    def post(self, request):
        """POST /api/v0/plans/update/location/ — update plan location"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        location = body.get("location", "").strip()

        if not location or len(location) > 80:
            return JsonResponse({"message": "Invalid location"}, status=400)

        try:
            plan = Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        plan.location = location
        plan.save()
        return JsonResponse({"plan": serialize_plan(plan)}, status=200)