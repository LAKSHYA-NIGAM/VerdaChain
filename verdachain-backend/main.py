from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from verifier import analyze_credit
from dotenv import load_dotenv
import hashlib
import json

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerifyRequest(BaseModel):
    creditId: str

@app.post("/verify")
async def verify_credit(request: VerifyRequest):
    result = analyze_credit(request.creditId)
    result_string = json.dumps(result, sort_keys=True)
    sha256_hash = hashlib.sha256(result_string.encode()).hexdigest()
    result["resultHash"] = f"0x{sha256_hash}"
    return result

@app.get("/health")
async def health():
    return {"status": "VerdaChain AI Engine running"}
