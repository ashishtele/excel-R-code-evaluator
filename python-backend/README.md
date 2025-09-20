# Python Backend for Feedback App

## Setup with UV (Recommended)
1. Check your Python version: `python --version` (must be 3.11+). If not, install via UV: `uv python install 3.11` (or `uv python pin 3.11` to set default).
2. In the `python-backend/` directory: `uv sync` (creates `.venv` with Python 3.11+ and installs deps; re-run if version was wrong).
3. Set environment variable: `export SECRET_KEY="your-secure-jwt-key-change-in-prod"` (or use `.env`).
4. Activate virtualenv: `source .venv/bin/activate` (or use `uv run` for commands).
5. Run the server: `uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000` (test at http://localhost:8000/docs).

If UV complains about versions, run `uv python list` to verify and `uv venv --python 3.11` to recreate the env.

## Alternative Setup with Pip
1. Install dependencies: `pip install -r requirements.txt`
2. Follow steps 3-5 above.

## Endpoints
- POST `/api/auth/register` - Register user (body: {"email": "test@example.com", "password": "pass123"})
- POST `/api/auth/login` - Login (form: username=email, password) returns JWT token
- POST `/api/feedback` - Submit feedback (requires Bearer token)
- GET `/api/feedback` - List feedbacks (requires Bearer token)

## Database
Uses SQLite (`feedback.db`) in the project root. Run migrations if needed (tables created on startup).