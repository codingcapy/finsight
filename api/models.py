from django.db import models


class User(models.Model):
    user_id = models.CharField(max_length=255, primary_key=True)
    username = models.CharField(max_length=32)
    email = models.CharField(max_length=256, unique=True)
    password = models.CharField(max_length=255)
    profile_pic = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=50, default="member")
    status = models.CharField(max_length=50, default="active")
    preference = models.CharField(max_length=50, default="light")
    created_at = models.DateTimeField(auto_now_add=True)
    current_plan = models.IntegerField(default=0)

    class Meta:
        db_table = "users"  # matches your existing postgres table name


class Plan(models.Model):
    plan_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        db_column="user",
        related_name="plans"
    )
    title = models.CharField(max_length=80)
    icon = models.CharField(max_length=255, null=True, blank=True)
    currency = models.CharField(max_length=10, default="$")
    location = models.CharField(max_length=80, default="Canada")
    year_of_birth = models.CharField(max_length=10, default="1990")
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "plans"


class Income(models.Model):
    income_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="incomes"
    )
    company = models.CharField(max_length=255, default="")
    position = models.CharField(max_length=255, default="")
    amount = models.BigIntegerField(default=0)  # stored as cents
    tax = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "incomes"


class Expenditure(models.Model):
    expenditure_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="expenditures"
    )
    name = models.CharField(max_length=255, default="")
    amount = models.BigIntegerField(default=0)  # stored as cents
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "expenditures"


class Asset(models.Model):
    asset_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="assets"
    )
    name = models.CharField(max_length=255, default="")
    value = models.BigIntegerField(default=0)  # stored as cents
    roi = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "assets"


class Liability(models.Model):
    liability_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="liabilities"
    )
    name = models.CharField(max_length=255, default="")
    amount = models.BigIntegerField(default=0)  # stored as cents
    interest = models.IntegerField(default=0)
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "liabilities"


class FinancialGoal(models.Model):
    financial_goal_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="financial_goals"
    )
    name = models.CharField(max_length=255, default="")
    amount = models.BigIntegerField(default=0)  # stored as cents
    target_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "financial_goals"


class Generation(models.Model):
    generation_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name="generations"
    )
    content = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "generations"