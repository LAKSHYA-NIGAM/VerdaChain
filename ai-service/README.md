# VerdaChain AI Verification Microservice

AI-powered carbon credit risk analysis API built with FastAPI.

## Quick Start

```bash
cd ai-service

# Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint   | Description                        |
|--------|------------|------------------------------------|
| POST   | `/verify`  | Run AI risk analysis on a credit   |
| GET    | `/`        | Health check                       |
| GET    | `/health`  | Health status                      |
| GET    | `/docs`    | Interactive Swagger UI             |
| GET    | `/redoc`   | ReDoc documentation                |

## Example Request

```bash
curl -X POST http://localhost:8000/verify \
  -H "Content-Type: application/json" \
  -d '{"creditId": "VCU-12345"}'
```

## Example Response

```json
{
  "creditId": "VCU-12345",
  "riskScore": 78,
  "flags": [
    "Duplicate credit detected across multiple registries",
    "Satellite imagery shows significant deforestation mismatch in project area"
  ],
  "confidence": 94.2,
  "timestamp": "2026-03-27T10:42:00.000Z"
}
```

## Project Structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app factory + CORS
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic request/response models
│   ├── routes/
│   │   ├── __init__.py
│   │   └── verify.py        # POST /verify endpoint
│   └── services/
│       ├── __init__.py
│       └── risk_analyzer.py # AI risk scoring engine
├── requirements.txt
└── README.md
```
