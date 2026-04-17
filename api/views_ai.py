import os
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from dotenv import load_dotenv
from openai import OpenAI

from .models import Plan, Income, Expenditure, Asset, Liability, FinancialGoal, Generation
from .views_plans import get_request_user
from .views_users import parse_body
from .views_generations import serialize_generation

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@method_decorator(csrf_exempt, name="dispatch")
class GenerateAIView(View):

    def post(self, request):
        """POST /api/v0/ai/generate/"""
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

        # Fetch all financial data for this plan
        incomes      = list(Income.objects.filter(plan_id=plan_id))
        expenditures = list(Expenditure.objects.filter(plan_id=plan_id))
        assets       = list(Asset.objects.filter(plan_id=plan_id))
        liabilities  = list(Liability.objects.filter(plan_id=plan_id))
        goals        = list(FinancialGoal.objects.filter(plan_id=plan_id))

        # --- Calculations (mirrors Hono, amounts stored as cents) ---
        total_income = round(
            sum((i.amount / 100) * (100 - i.tax / 100) / 100 for i in incomes), 2
        )
        total_expenditure = round(sum(e.amount / 100 for e in expenditures), 2)
        cashflow          = round(total_income - total_expenditure, 2)
        total_assets      = round(sum(a.value / 100 for a in assets), 2)
        total_liabilities = round(sum(l.amount / 100 for l in liabilities), 2)
        net_worth         = round(total_assets - total_liabilities, 2)

        # --- Format text summaries for the prompt ---
        currency = plan.currency

        incomes_text = "\n".join(
            f"{i.position}{f' at {i.company}' if i.company else ''}: "
            f"{currency}{(i.amount / 100):.2f} with tax %{(i.tax / 100):.2f} "
            f"therefore net {(((i.amount / 100) * (100 - i.tax / 100)) / 100):.2f}"
            for i in incomes
        )
        expenditures_text = "\n".join(
            f"{e.name}: {currency}{(e.amount / 100):.2f}" for e in expenditures
        )
        assets_text = "\n".join(
            f"{a.name}: {currency}{(a.value / 100):.2f} with ROI %{(a.roi / 100):.2f}"
            for a in assets
        )
        liabilities_text = "\n".join(
            f"{l.name}: {currency}{(l.amount / 100):.2f} with interest %{(l.interest / 100):.2f}"
            for l in liabilities
        )
        goals_text = "\n".join(
            f"{g.name}: {currency}{(g.amount / 100):.2f} with target date {g.target_date}"
            for g in goals
        )

        # --- Call OpenAI Responses API ---
        try:
            completion = client.responses.create(
                model="gpt-4o",  # gpt-5.4 doesn't exist yet, using gpt-4o
                temperature=0.4,
                input=[
                    {
                        "role": "system",
                        "content": "You are a certified financial planner providing clear financial advice.",
                    },
                    {
                        "role": "user",
                        "content": f"""
Provide financial advice for the following client data

Year of birth: {plan.year_of_birth}
Country of residence: {plan.location}
Currency: {plan.currency}
Total income: {total_income}
Total expenditure: {total_expenditure}
Cashflow: {cashflow}
Total assets: {total_assets}
Total liabilities: {total_liabilities}
Net worth: {net_worth}

Here is the raw data for your reference. DO NOT try to derive values from these as I already provided you with the correct values above. Only use this data to potentially reference specific items if you deem necessary.

INCOME SOURCES (monthly):
{incomes_text}

EXPENDITURES (monthly):
{expenditures_text}

ASSETS:
{assets_text}

LIABILITIES:
{liabilities_text}

FINANCIAL GOALS:
{goals_text}

Limit your advice to no more than 1500 characters
ALWAYS take into consideration the client's age and country of residence and whether this means they are willing to take more risks or retired and comfortable or trying to raise a family
ALWAYS start with "Based on the provided financial data, here's a comprehensive analysis of your"
                        """,
                    },
                ],
            )
            content = completion.output_text or "error generating recommendation"
        except Exception as e:
            print(f"[openai] Error: {e}")
            return JsonResponse({"message": "Error generating AI recommendation"}, status=500)

        # Save the generation
        generation = Generation.objects.create(
            plan=plan,
            content=content,
        )

        return JsonResponse({"generation": serialize_generation(generation)}, status=200)