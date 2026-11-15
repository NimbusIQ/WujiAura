import json
from typing import Dict, List, Any

# --- RAG Knowledge Base Simulation ---
# In a production environment, this data would be fine-tuned via supervised tuning on a Gemma model.
# The knowledge base (Firmament/Guardrails) contains hard-coded TCM knowledge, organ clock logic,
# and specific dietary/herbal recommendations for deterministic outputs.

def get_tcm_knowledge_base() -> Dict:
    """Simulates retrieving hard-coded TCM knowledge and organ clock logic."""
    return {
        "organ_disharmonies": {
            "Liver Qi Stagnation": {
                "facial_biomarker": "furrow between brows",
                "symptoms": ["fatigue", "stomach discomfort", "irritability"],
                "dietary_recommendation": "dandelion greens, lemon water, peppermint tea",
                "avoid": ["spicy foods", "excessive alcohol"]
            },
            "Heart Heat": {
                "facial_biomarker": "red tongue tip",
                "symptoms": ["anxiety", "insomnia", "palpitations"],
                "dietary_recommendation": "lotus seed, lily bulb, bitter melon",
                "avoid": ["coffee", "spicy foods", "red meat"]
            },
            "Spleen Deficiency": {
                "facial_biomarker": "sallow complexion",
                "symptoms": ["bloating", "poor digestion", "excessive worry"],
                "dietary_recommendation": "sweet potato, pumpkin, oats, ginger tea",
                "avoid": ["ice water", "raw foods"]
            }
        },
        "organ_clock": {
            "Liver": "1 AM - 3 AM",
            "Spleen": "9 AM - 11 AM",
            "Heart": "11 AM - 1 PM",
            "Stomach": "7 AM - 9 AM",
            "Lung": "3 AM - 5 AM"
        },
        "biomarker_to_tcm": {
            "furrow between brows": "Liver Qi Stagnation",
            "red tongue tip": "Heart Heat",
            "sallow complexion": "Spleen Deficiency"
        }
    }

# --- AI Agent Logic: TCM Agent (Dr. Yu) ---

def run_tcm_agent_analysis(user_profile: Dict, multimodal_inputs: Dict) -> Dict:
    """Analyzes user data against hard-coded TCM rules to provide a diagnosis and recommendation."""
    
    # 1. Load Hard-Coded TCM Knowledge (Firmament/Guardrails)
    knowledge_base = get_tcm_knowledge_base()
    
    # 2. Extract Multimodal Inputs (from Live Agent/SpotEye sensor)
    facial_analysis = multimodal_inputs.get("facial_analysis", {})
    reported_symptoms = multimodal_inputs.get("voice_journal_text", "").lower()
    
    # 3. Deterministic Diagnosis Loop (SAE Instinctual Logic)
    diagnosis = []
    recommendations = []
    
    # Rule 1: Check for Liver Qi Stagnation
    if "furrow between brows" in facial_analysis.get("biomarkers", []) and any(s in reported_symptoms for s in ["fatigue", "stomach discomfort"]):
        diagnosis.append("Liver Qi Stagnation")
        recommendations.append(knowledge_base["organ_disharmonies"]["Liver Qi Stagnation"]["dietary_recommendation"])
    
    # Rule 2: Check for Heart Heat
    if "red tongue tip" in facial_analysis.get("biomarkers", []) and any(s in reported_symptoms for s in ["anxiety", "insomnia"]):
        diagnosis.append("Heart Heat")
        recommendations.append(knowledge_base["organ_disharmonies"]["Heart Heat"]["dietary_recommendation"])
    
    # 4. Agentic Output Generation (Deterministic Response)
    if diagnosis:
        status_message = f"Dr. Yu's Diagnosis: Detected {', '.join(diagnosis)}."
    else:
        status_message = "No specific disharmony detected today. Continue monitoring for patterns."
    
    return {
        "user_id": user_profile["id"],
        "diagnosis": diagnosis,
        "recommendations": recommendations,
        "status": status_message,
        "organ_clock_tip": f"Reminder: The {knowledge_base['organ_clock']['Spleen']} time (9 AM - 11 AM) is best for digestion. Pay attention to your eating habits during this time."
    }

# --- Example Execution (Simulate UI Navigator/Live Agent Input) ---
example_user_profile = {
    "id": "user-123",
    "name": "Jane Doe",
    "preferences": {"language": "en"}
}
example_multimodal_inputs = {
    "facial_analysis": {
        "biomarkers": ["clear eyes", "furrow between brows"],
        "skin_complexion": "normal"
    },
    "voice_journal_text": "I felt really tired and bloated after lunch today. I just couldn't concentrate."
}

# Run the agent
agent_response = run_tcm_agent_analysis(example_user_profile, example_multimodal_inputs)
print(json.dumps(agent_response, indent=2))
