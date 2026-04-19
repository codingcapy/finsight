from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Asset, Plan
from .views_plans import get_request_user
from .views_users import parse_body


def serialize_asset(asset: Asset) -> dict:
    return {
        "assetId": asset.asset_id,
        "planId": asset.plan_id,
        "name": asset.name,
        "value": asset.value,
        "roi": asset.roi,
        "status": asset.status,
        "createdAt": asset.created_at.isoformat(),
    }


@method_decorator(csrf_exempt, name="dispatch")
class AssetsView(View):

    def post(self, request):
        """POST /api/v0/assets/"""
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

        asset = Asset.objects.create(
            plan_id=plan_id,
            name=body.get("name", ""),
            value=body.get("value", 0),
            roi=body.get("roi", 0),
        )
        return JsonResponse({"asset": serialize_asset(asset)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class AssetsByPlanView(View):

    def get(self, request, plan_id):
        """GET /api/v0/assets/<plan_id>/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        assets = Asset.objects.filter(plan_id=plan_id)
        return JsonResponse({"assets": [serialize_asset(a) for a in assets]}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class DeleteAssetView(View):

    def post(self, request):
        """POST /api/v0/assets/delete/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        asset_id = body.get("assetId")

        if asset_id is None:
            return JsonResponse({"message": "assetId is required"}, status=400)

        try:
            asset = Asset.objects.select_related("plan").get(
                asset_id=asset_id, plan__user=user
            )
        except Asset.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        asset.delete()
        return JsonResponse({"asset": serialize_asset(asset)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdateAssetView(View):

    def post(self, request):
        """POST /api/v0/assets/update/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        asset_id = body.get("assetId")

        if asset_id is None:
            return JsonResponse({"message": "assetId is required"}, status=400)

        try:
            asset = Asset.objects.select_related("plan").get(
                asset_id=asset_id, plan__user=user
            )
        except Asset.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        if "name" in body:
            asset.name = body["name"]
        if "value" in body:
            asset.value = body["value"]
        if "roi" in body:
            asset.roi = body["roi"]

        asset.save()
        return JsonResponse({"asset": serialize_asset(asset)}, status=200)