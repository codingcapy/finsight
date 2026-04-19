from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Liability, Plan
from .views_plans import get_request_user
from .views_users import parse_body


def serialize_liability(liability: Liability) -> dict:
    return {
        "liabilityId": liability.liability_id,
        "planId": liability.plan_id,
        "name": liability.name,
        "amount": liability.amount,
        "interest": liability.interest,
        "status": liability.status,
        "createdAt": liability.created_at.isoformat(),
    }


@method_decorator(csrf_exempt, name="dispatch")
class LiabilitiesView(View):

    def post(self, request):
        """POST /api/v0/liabilities/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")

        if plan_id is None:
            return JsonResponse({"message": "planId is required"}, status=400)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        liability = Liability.objects.create(
            plan_id=plan_id,
            name=body.get("name", ""),
            amount=body.get("amount", 0),
            interest=body.get("interest", 0),
        )
        return JsonResponse({"liability": serialize_liability(liability)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class LiabilitiesByPlanView(View):

    def get(self, request, plan_id):
        """GET /api/v0/liabilities/<plan_id>/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        liabilities = Liability.objects.filter(plan_id=plan_id)
        return JsonResponse({"liabilities": [serialize_liability(l) for l in liabilities]}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DeleteLiabilityView(View):

    def post(self, request):
        """POST /api/v0/liabilities/delete/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        liability_id = body.get("liabilityId")

        if liability_id is None:
            return JsonResponse({"message": "liabilityId is required"}, status=400)

        try:
            liability = Liability.objects.select_related("plan").get(
                liability_id=liability_id, plan__user=user
            )
        except Liability.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        liability.delete()
        return JsonResponse({"liability": serialize_liability(liability)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdateLiabilityView(View):

    def post(self, request):
        """POST /api/v0/liabilities/update/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        liability_id = body.get("liabilityId")

        if liability_id is None:
            return JsonResponse({"message": "liabilityId is required"}, status=400)

        try:
            liability = Liability.objects.select_related("plan").get(
                liability_id=liability_id, plan__user=user
            )
        except Liability.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        if "name" in body:
            liability.name = body["name"]
        if "amount" in body:
            liability.amount = body["amount"]
        if "interest" in body:
            liability.interest = body["interest"]

        liability.save()
        return JsonResponse({"liability": serialize_liability(liability)}, status=200)