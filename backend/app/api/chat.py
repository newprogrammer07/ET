"""
Chat endpoint for Claude API — used by the Market Video script generator.
"""
import os
import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    systemPrompt: Optional[str] = "You are a helpful AI assistant."
    question: str

@router.post("/")
async def chat_with_claude(request: ChatRequest):
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    
    if not api_key:
        # Return a mock video script so the feature doesn't break without a key
        return {
            "response": json.dumps({
                "headline": "Markets Rally On Strong Signals",
                "scene1": "Nifty Fifty surges past key resistance, now trading at twenty-two thousand eight hundred with strong momentum.",
                "scene2": "Our top signal today: Tata Motors shows a volume surge breakout with a score of eighty-nine out of hundred.",
                "scene3": "FII inflows remain strong at two thousand one hundred crore while DII added sixteen hundred crore. Not investment advice."
            })
        }
    
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            system=request.systemPrompt,
            messages=[{"role": "user", "content": request.question}]
        )
        
        response_text = message.content[0].text if message.content else ""
        
        return {"response": response_text}
        
    except Exception as e:
        print(f"[Chat] Claude API error: {e}")
        return {
            "response": json.dumps({
                "headline": "Markets Rally On Strong Signals",
                "scene1": "Nifty Fifty surges past key resistance with strong momentum across sectors today.",
                "scene2": "Our top signal today shows a high-conviction breakout pattern with an impressive win rate.",
                "scene3": "Institutional flows remain positive with strong FII and DII participation. Not investment advice."
            })
        }
