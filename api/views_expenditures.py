from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Expenditure, Plan
from .views_plans import get_request_user
from .views_users import parse_body


def serialize_expenditure(expenditure: Expenditure) -> dict:
    return {
        "expenditure_id": expenditure.expenditure_id,
        "plan_id": expenditure.plan_id,
        "name": expenditure.name,
        "amount": expenditure.amount,
        "status": expenditure.status,
        "created_at": expenditure.created_at.isoformat(),
    }


@method_decorator(csrf_exempt, name="dispatch")
class ExpendituresView(View):

    def post(self, request):
        """POST /api/v0/expenditures/ — create an expenditure"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        plan_id = body.get("planId")
        name = body.get("name", "")
        amount = body.get("amount", 0)

        if plan_id is None:
            return JsonResponse({"message": "planId is required"}, status=400)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        expenditure = Expenditure.objects.create(
            plan_id=plan_id,
            name=name,
            amount=amount,
        )
        return JsonResponse({"expenditure": serialize_expenditure(expenditure)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class ExpendituresByPlanView(View):

    def get(self, request, plan_id):
        """GET /api/v0/expenditures/<plan_id>/ — get all expenditures for a plan"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        expenditures = Expenditure.objects.filter(plan_id=plan_id)
        return JsonResponse({"expenditures": [serialize_expenditure(e) for e in expenditures]}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DeleteExpenditureView(View):

    def post(self, request):
        """POST /api/v0/expenditures/delete/ — delete an expenditure"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        expenditure_id = body.get("expenditureId")

        if expenditure_id is None:
            return JsonResponse({"message": "expenditureId is required"}, status=400)

        try:
            expenditure = Expenditure.objects.select_related("plan").get(
                expenditure_id=expenditure_id,
                plan__user=user
            )
        except Expenditure.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        expenditure.delete()
        return JsonResponse({"expenditure": serialize_expenditure(expenditure)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdateExpenditureView(View):

    def post(self, request):
        """POST /api/v0/expenditures/update/ — update an expenditure"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        expenditure_id = body.get("expenditureId")

        if expenditure_id is None:
            return JsonResponse({"message": "expenditureId is required"}, status=400)

        try:
            expenditure = Expenditure.objects.select_related("plan").get(
                expenditure_id=expenditure_id,
                plan__user=user
            )
        except Expenditure.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        if "name" in body:
            expenditure.name = body["name"]
        if "amount" in body:
            expenditure.amount = body["amount"]

        expenditure.save()
        return JsonResponse({"expenditure": serialize_expenditure(expenditure)}, status=200)