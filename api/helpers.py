from .models import Plan

def check_plan_item_limit(plan_id, model, limit=20) -> bool:
    """Returns True if the plan is under the item limit."""
    return model.objects.filter(plan_id=plan_id).count() < limit

def check_plan_ownership(user, plan_id) -> Plan | None:
    """Returns the plan if it belongs to the user, else None."""
    try:
        return Plan.objects.get(plan_id=plan_id, user=user)
    except Plan.DoesNotExist:
        return None