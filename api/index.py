import json
import os
from functools import wraps

from flask import Flask, jsonify, request, session
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from psycopg import connect
from psycopg.rows import dict_row


DEFAULT_TEACHER_ALLOWLIST = {"soongchee.gi@gmail.com"}
DEFAULT_MODULES = {"technology-and-ethics"}
MAX_STATE_BYTES = 200_000  # cap per-student saved state at ~200 KB


def parse_allowlist():
    raw = os.getenv("TEACHER_ALLOWLIST", "")
    items = {email.strip().lower() for email in raw.split(",") if email.strip()}
    return items or DEFAULT_TEACHER_ALLOWLIST


def parse_modules():
    # Add future topics (e.g. socket-programming, nosql) via the
    # ALLOWED_MODULES env var without a code change.
    raw = os.getenv("ALLOWED_MODULES", "")
    items = {slug.strip().lower() for slug in raw.split(",") if slug.strip()}
    return items or DEFAULT_MODULES


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    app.config["JSON_SORT_KEYS"] = False
    app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # reject request bodies over 1 MB
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = (
        os.getenv("SECURE_COOKIES", "true" if os.getenv("VERCEL") else "false").lower() == "true"
    )

    database_url = os.getenv("DATABASE_URL", "").strip()
    google_client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    teacher_allowlist = parse_allowlist()
    allowed_modules = parse_modules()

    @app.after_request
    def set_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Cache-Control", "no-store")
        return response

    def get_conn():
        if not database_url:
            raise RuntimeError("DATABASE_URL is not configured.")
        return connect(database_url, row_factory=dict_row)

    def ensure_schema():
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS app_users (
                    id SERIAL PRIMARY KEY,
                    google_sub TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    picture TEXT,
                    role TEXT NOT NULL DEFAULT 'student',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS module_states (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
                    module_slug TEXT NOT NULL,
                    state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    UNIQUE(user_id, module_slug)
                )
                """
            )

    if database_url:
        ensure_schema()

    def public_user(user_row):
        return {
            "id": user_row["id"],
            "email": user_row["email"],
            "name": user_row["name"],
            "picture": user_row.get("picture"),
            "role": user_row["role"],
        }

    def validate_module(module_slug):
        if module_slug not in allowed_modules:
            raise ValueError("Unsupported module.")
        return module_slug

    def upsert_user(profile):
        email = profile["email"].strip().lower()
        role = "teacher" if email in teacher_allowlist else "student"
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO app_users (google_sub, email, name, picture, role)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (google_sub)
                DO UPDATE SET
                    email = EXCLUDED.email,
                    name = EXCLUDED.name,
                    picture = EXCLUDED.picture,
                    role = EXCLUDED.role,
                    updated_at = NOW()
                RETURNING id, email, name, picture, role
                """,
                (
                    profile["sub"],
                    email,
                    profile.get("name") or email,
                    profile.get("picture"),
                    role,
                ),
            )
            return cur.fetchone()

    def get_user_by_id(user_id):
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, email, name, picture, role
                FROM app_users
                WHERE id = %s
                """,
                (user_id,),
            )
            return cur.fetchone()

    def current_user():
        user_id = session.get("user_id")
        if not user_id:
            return None
        return get_user_by_id(user_id)

    def login_required(handler):
        @wraps(handler)
        def wrapped(*args, **kwargs):
            user = current_user()
            if not user:
                return jsonify({"error": "Authentication required."}), 401
            request.current_user = user
            return handler(*args, **kwargs)

        return wrapped

    def teacher_required(handler):
        @wraps(handler)
        @login_required
        def wrapped(*args, **kwargs):
            if request.current_user["role"] != "teacher":
                return jsonify({"error": "Teacher access required."}), 403
            return handler(*args, **kwargs)

        return wrapped

    @app.errorhandler(RuntimeError)
    def handle_runtime_error(exc):
        return jsonify({"error": str(exc)}), 500

    @app.errorhandler(413)
    def handle_too_large(exc):
        return jsonify({"error": "Request body too large."}), 413

    @app.errorhandler(ValueError)
    def handle_value_error(exc):
        return jsonify({"error": str(exc)}), 400

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.get("/api/config")
    def config():
        return jsonify(
            {
                "googleClientId": google_client_id,
                "moduleSlug": "technology-and-ethics",
                "teacherDashboardPath": "/teacher.html",
            }
        )

    @app.get("/api/me")
    def me():
        user = current_user()
        return jsonify({"authenticated": bool(user), "user": public_user(user) if user else None})

    @app.post("/api/auth/google")
    def auth_google():
        payload = request.get_json(silent=True) or {}
        credential = payload.get("credential", "").strip()
        if not google_client_id:
            raise RuntimeError("GOOGLE_CLIENT_ID is not configured.")
        if not credential:
            raise ValueError("Missing Google credential.")

        token_payload = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id,
        )
        issuer = token_payload.get("iss")
        if issuer not in {"accounts.google.com", "https://accounts.google.com"}:
            raise ValueError("Invalid Google token issuer.")
        if not token_payload.get("email"):
            raise ValueError("Google account email is missing.")

        user = upsert_user(token_payload)
        session.clear()
        session["user_id"] = user["id"]
        return jsonify({"authenticated": True, "user": public_user(user)})

    @app.post("/api/auth/logout")
    def logout():
        session.clear()
        return jsonify({"ok": True})

    @app.get("/api/student/state")
    @login_required
    def get_student_state():
        module_slug = validate_module(request.args.get("module", "").strip())
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT state_json, updated_at
                FROM module_states
                WHERE user_id = %s AND module_slug = %s
                """,
                (request.current_user["id"], module_slug),
            )
            row = cur.fetchone()
        return jsonify(
            {
                "module": module_slug,
                "state": row["state_json"] if row else {},
                "updatedAt": row["updated_at"].isoformat() if row else None,
            }
        )

    @app.put("/api/student/state")
    @login_required
    def put_student_state():
        payload = request.get_json(silent=True) or {}
        module_slug = validate_module((payload.get("module") or "").strip())
        state_json = payload.get("state")
        if not isinstance(state_json, dict):
            raise ValueError("State payload must be an object.")
        serialized_state = json.dumps(state_json)
        if len(serialized_state) > MAX_STATE_BYTES:
            raise ValueError("State payload too large.")

        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO module_states (user_id, module_slug, state_json)
                VALUES (%s, %s, %s::jsonb)
                ON CONFLICT (user_id, module_slug)
                DO UPDATE SET
                    state_json = EXCLUDED.state_json,
                    updated_at = NOW()
                RETURNING updated_at
                """,
                (request.current_user["id"], module_slug, serialized_state),
            )
            row = cur.fetchone()
        return jsonify({"ok": True, "updatedAt": row["updated_at"].isoformat()})

    @app.delete("/api/student/state")
    @login_required
    def delete_student_state():
        module_slug = validate_module(request.args.get("module", "").strip())
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM module_states
                WHERE user_id = %s AND module_slug = %s
                """,
                (request.current_user["id"], module_slug),
            )
        return jsonify({"ok": True})

    @app.get("/api/teacher/responses")
    @teacher_required
    def teacher_responses():
        module_slug = validate_module(request.args.get("module", "").strip())
        with get_conn() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    u.id AS user_id,
                    u.email,
                    u.name,
                    u.role,
                    u.picture,
                    ms.state_json,
                    ms.updated_at
                FROM module_states ms
                JOIN app_users u ON u.id = ms.user_id
                WHERE ms.module_slug = %s
                ORDER BY ms.updated_at DESC, u.email ASC
                """,
                (module_slug,),
            )
            rows = cur.fetchall()

        return jsonify(
            {
                "module": module_slug,
                "responses": [
                    {
                        "user": {
                            "id": row["user_id"],
                            "email": row["email"],
                            "name": row["name"],
                            "role": row["role"],
                            "picture": row["picture"],
                        },
                        "state": row["state_json"],
                        "updatedAt": row["updated_at"].isoformat(),
                    }
                    for row in rows
                ],
            }
        )

    return app


app = create_app()
