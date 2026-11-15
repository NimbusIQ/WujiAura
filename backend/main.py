from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from google.cloud import vertexai
from vertexai.preview.agent_builder import Agent, Tool
from google.cloud import aiplatform

app = FastAPI(title="Antigravity TCM Agent API")

# --- 1. Initialize Vertex AI ---
# These should be set in your Cloud Run environment variables
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "your-gcp-project-id")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
INDEX_ENDPOINT = os.getenv("VDB_INDEX_ENDPOINT") # projects/.../indexEndpoints/...

vertexai.init(project=PROJECT_ID, location=LOCATION)

# --- 2. Define Tools ---

# RAG Tool: Unstructured TCM Knowledge (NotebookLM Exports)
rag_tool = Tool.from_retrieval(
    retrieval=aiplatform.MatchingEngineIndexEndpoint(
        index_endpoint_name=INDEX_ENDPOINT
    ) if INDEX_ENDPOINT else None,
    name="notebook_knowledge_base",
    description="Accesses the source of truth for TCM diagnostics and Wuxing philosophy."
)

# MCP Tool: Structured PostgreSQL Data (User History)
# Note: In a real Cloud Run setup, this would connect to Cloud SQL
mcp_tool = Tool.from_function(
    name="query_user_metrics",
    function_declaration={
        "name": "get_tcm_score",
        "description": "Retrieve current organ vitality scores and historical biomarkers from SQL.",
        "parameters": {
            "type": "object", 
            "properties": {
                "user_id": {"type": "string"},
                "days_back": {"type": "integer", "default": 30}
            },
            "required": ["user_id"]
        }
    }
)

# --- 3. Construct the Antigravity Agent ---
# Instructions derived from NotebookLM TCM Knowledge Base
SYSTEM_INSTRUCTION = """
You are the 'Antigravity' Master Brain Agent, an expert in Traditional Chinese Medicine (TCM) and Wuxing (Five Elements) theory.
Your knowledge is grounded in the authoritative documents from the 'notebook_knowledge_base'.

DIAGNOSTIC PROTOCOL:
1. BIO-DATA RETRIEVAL: First, use 'notebook_knowledge_base' to look up specific TCM syndromes related to the user's symptoms.
2. HISTORICAL CONTEXT: Use 'query_user_metrics' to see if this is a recurring pattern for the user.
3. FACIAL MAPPING (Wuxing):
   - Forehead/Brows -> Wood (Liver/Gallbladder). Imbalance: Furrows, green tint.
   - Tongue Tip/Complexion -> Fire (Heart/Small Intestine). Imbalance: Redness, palpitations.
   - Mouth/Lips -> Earth (Spleen/Stomach). Imbalance: Sallow skin, bloating.
   - Cheeks -> Metal (Lungs/Large Intestine). Imbalance: Pale skin, dry cough.
   - Chin/Under-eye -> Water (Kidneys/Bladder). Imbalance: Dark circles, lower back pain.

4. SYNTHESIS:
   - Provide a 'Syndrome Differentiation' (e.g., Liver Qi Stagnation).
   - Explain the Wuxing cycle relationship (e.g., 'Wood over-acting on Earth').
   - Recommend dietary adjustments (flavors: Sour, Bitter, Sweet, Pungent, Salty).
   - Suggest lifestyle changes based on the Organ Clock.

TONE: Professional, scientific, and empathetic. Use First Principles Thinking.
"""

antigravity_agent = Agent(
    model_name="gemini-1.5-pro-002",
    system_instruction=SYSTEM_INSTRUCTION,
    tools=[rag_tool, mcp_tool]
)

# --- 4. API Endpoints ---

class AnalysisRequest(BaseModel):
    user_id: str
    voice_journal: str
    facial_biomarkers: List[str]
    image_base64: Optional[str] = None

class FeedbackRequest(BaseModel):
    message_id: str
    rating: int  # 1 for up, -1 for down
    comment: Optional[str] = None

@app.post("/analyze")
async def analyze_health(request: AnalysisRequest):
    try:
        prompt = f"""
        User ID: {request.user_id}
        Voice Journal: {request.voice_journal}
        Facial Biomarkers Detected: {', '.join(request.facial_biomarkers)}
        
        Please run a full Wuxing diagnostic analysis using the NotebookLM knowledge base.
        """
        
        response = antigravity_agent.ask(prompt)
        return {"status": "success", "analysis": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    # In a real app, this would save to your PostgreSQL database
    print(f"Feedback received for {request.message_id}: {request.rating}")
    return {"status": "feedback_recorded"}

@app.get("/health")
async def health_check():
    return {"status": "online", "agent": "Antigravity-v1"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
