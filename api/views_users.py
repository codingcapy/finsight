import os
import hashlib
import secrets
import json
import uuid6
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import resend

from .models import User, Plan


# --- Password Helpers ---

def hash_password(password: str) -> str:
    """Mirrors the scrypt implementation from the Hono app."""
    salt = secrets.token_hex(16)
    key = hashlib.scrypt(
        password.encode(),
        salt=salt.encode(),
        n=16384,
        r=8,
        p=1,
        dklen=64
    )
    return f"{salt}:{key.hex()}"


def parse_body(request) -> dict:
    """Helper to parse JSON request body."""
    try:
        return json.loads(request.body)
    except Exception:
        return {}


# --- Views ---

@method_decorator(csrf_exempt, name="dispatch")
class CreateUserView(View):
    """POST /api/v0/users/"""

    def post(self, request):
        body = parse_body(request)
        username = body.get("username", "").strip()
        email = body.get("email", "").strip()
        password = body.get("password", "").strip()

        # Basic validation
        if not username or len(username) > 32:
            return JsonResponse({"message": "Invalid username"}, status=400)
        if not email or len(email) > 256:
            return JsonResponse({"message": "Invalid email"}, status=400)
        if not password or len(password) > 128:
            return JsonResponse({"message": "Invalid password"}, status=400)

        # Check email uniqueness
        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"message": "An account with this email already exists"},
                status=409
            )

        # Check username uniqueness
        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"message": "An account with this username already exists"},
                status=409
            )

        # Create user
        encrypted = hash_password(password)
        user_id = str(uuid6.uuid7())

        user = User.objects.create(
            user_id=user_id,
            username=username,
            email=email,
            password=encrypted,
        )

        # Auto-create default plan (mirrors Hono behavior)
        Plan.objects.create(
            user=user,
            title=f"{user.username}'s plan",
        )

        return JsonResponse({"user": serialize_user(user)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdateCurrentPlanView(View):
    """POST /api/v0/users/update/currentplan/"""

    def post(self, request):
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        current_plan = body.get("currentPlan")

        if current_plan is None or not isinstance(current_plan, int):
            return JsonResponse({"message": "Invalid currentPlan"}, status=400)

        user.current_plan = current_plan
        user.save()

        return JsonResponse({"user": serialize_user(user)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class UpdatePasswordView(View):
    """POST /api/v0/users/update/password/"""

    def post(self, request):
        user = get_request_user(request)
        if not user:
            return JsonResponse({"message": "Unauthorized"}, status=401)

        body = parse_body(request)
        password = body.get("password", "").strip()

        if not password or len(password) > 128:
            return JsonResponse({"message": "Invalid password"}, status=400)

        user.password = hash_password(password)
        user.save()

        return JsonResponse({"user": serialize_user(user)}, status=200)


@method_decorator(csrf_exempt, name="dispatch")
class PasswordResetView(View):
    """POST /api/v0/users/passwordreset/"""

    def post(self, request):
        body = parse_body(request)
        email = body.get("email", "").strip()

        if not email:
            return JsonResponse({"message": "Invalid email"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Silent — don't leak whether email exists (mirrors Hono)
            return JsonResponse({"success": True}, status=200)

        original_password = user.password

        # Generate a temp plaintext code and hash it as the new password
        code = secrets.token_hex(32)
        hashed_code = hash_password(code)
        user.password = hashed_code
        user.save()

        # Send email via Resend
        resend.api_key = os.getenv("RESEND_API_KEY")
        try:
            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": email,
                "subject": "CapyPlan Password Reset Request",
                "html": f"""
                    <p>A password reset request was submitted for this email address.</p>
                    <p>Your temporary password is:</p>
                    <pre>{code}</pre>
                    <p>Please login and change your password immediately in your settings menu.</p>
                    <p>Best regards,</p>
                    <p>The CapyPlan Team</p>
                """,
            })
        except Exception as e:
            print(f"[resend] Failed: {e}")
            # Roll back password on email failure (mirrors Hono)
            user.password = original_password
            user.save()
            return JsonResponse({"success": False}, status=500)

        return JsonResponse({"success": True}, status=200)


# --- Helpers ---

def get_request_user(request) -> User | None:
    """Reads and validates JWT from Authorization header."""
    from .views_user import decode_token
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


def serialize_user(user: User) -> dict:
    """Converts a User model instance to a JSON-safe dict."""
    return {
        "userId": user.user_id,
        "username": user.username,
        "email": user.email,
        "profilePic": user.profile_pic,
        "role": user.role,
        "status": user.status,
        "preference": user.preference,
        "createdAt": user.created_at.isoformat(),
        "currentPlan": user.current_plan,
    }