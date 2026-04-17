import os
import hashlib
import json
import jwt
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import User
from .views_users import serialize_user, parse_body
from dotenv import load_dotenv 

load_dotenv()


# --- Password Helpers ---

def verify_password(hash_str: str, password: str) -> bool:
    """Mirrors the scrypt verifyPassword from user.ts."""
    parts = hash_str.split(":")
    if len(parts) != 2:
        return False
    salt, key_hex = parts
    derived = hashlib.scrypt(
        password.encode(),
        salt=salt.encode(),
        n=16384,
        r=8,
        p=1,
        dklen=64
    )
    return derived.hex() == key_hex


def create_token(user_id: str) -> str:
    """Creates a JWT token valid for 14 days, mirrors jsonwebtoken sign."""
    payload = {
        "id": user_id,
        "exp": datetime.now(tz=timezone.utc) + timedelta(days=14),
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")


def decode_token(token: str) -> dict | None:
    """Decodes and validates a JWT token. Returns payload or None."""
    try:
        return jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


# --- Views ---

@method_decorator(csrf_exempt, name="dispatch")
class LoginView(View):
    """POST /api/v0/user/login/"""

    def post(self, request):
        body = parse_body(request)
        email = body.get("email", "").strip()
        password = body.get("password", "").strip()

        if not email or not password:
            return JsonResponse({"result": {"user": None, "token": None}})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"result": {"user": None, "token": None}})

        if not verify_password(user.password, password):
            return JsonResponse({"result": {"user": None, "token": None}})

        token = create_token(user.user_id)
        return JsonResponse({"result": {"user": serialize_user(user), "token": token}})


@method_decorator(csrf_exempt, name="dispatch")
class ValidationView(View):
    """POST /api/v0/user/validation/"""

    def post(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header:
            return JsonResponse({"message": "Header does not exist"}, status=403)

        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return JsonResponse({"message": "Invalid authorization header"}, status=403)

        token = parts[1]
        payload = decode_token(token)
        if payload is None:
            return JsonResponse({"message": "Invalid or expired token"}, status=401)

        try:
            user = User.objects.get(user_id=payload["id"])
        except User.DoesNotExist:
            return JsonResponse({"message": "User not found"}, status=401)

        return JsonResponse({"result": {"user": serialize_user(user), "token": token}})