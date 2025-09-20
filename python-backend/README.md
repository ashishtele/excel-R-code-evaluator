# Python Backend for Feedback App

## Setup with UV (Recommended)
1. Install UV globally: `pipx install uv` (or `curl -LsSf https://astral.sh/uv/install.sh | sh`)
2. In the `python-backend/` directory: `uv sync` (this creates `.venv` and installs dependencies)
3. Set environment variable: `export SECRET_KEY="your-secure-jwt-key"`
4. Activate virtualenv: `source .venv/bin/activate` (or use `uv run` for commands)
5. Run the server: `uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000`

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