from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Generation, Plan
from .views_plans import get_request_user
from .views_users import parse_body


def serialize_generation(generation: Generation) -> dict:
    return {
        "generationId": generation.generation_id,
        "planId": generation.plan_id,
        "content": generation.content,
        "createdAt": generation.created_at.isoformat(),
    }


@method_decorator(csrf_exempt, name="dispatch")
class GenerationsByPlanView(View):

    def get(self, request, plan_id):
        """GET /api/v0/generations/<plan_id>/?page=1&pageSize=5"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            Plan.objects.get(plan_id=plan_id, user=user)
        except Plan.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        try:
            page = max(1, int(request.GET.get("page", 1)))
            page_size = min(50, max(1, int(request.GET.get("pageSize", 5))))
        except ValueError:
            return JsonResponse({"message": "Invalid pagination parameters"}, status=400)

        offset = (page - 1) * page_size
        qs = Generation.objects.filter(plan_id=plan_id).order_by("-created_at")
        batch = list(qs[offset : offset + page_size + 1])
        has_more = len(batch) > page_size

        return JsonResponse(
            {
                "generations": [serialize_generation(g) for g in batch[:page_size]],
                "hasMore": has_more,
            },
            status=200,
        )


@method_decorator(csrf_exempt, name="dispatch")
class DeleteGenerationView(View):

    def post(self, request):
        """POST /api/v0/generations/delete/"""
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        generation_id = body.get("generationId")

        if generation_id is None:
            return JsonResponse({"message": "generationId is required"}, status=400)

        try:
            generation = Generation.objects.select_related("plan").get(
                generation_id=generation_id, plan__user=user
            )
        except Generation.DoesNotExist:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        generation.delete()
        return JsonResponse({"generation": serialize_generation(generation)}, status=200)