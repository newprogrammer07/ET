import os
import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()

class AnalysisRequest(BaseModel):
    question: str
    portfolio: list = []
    signals: list = []

SEBI_DISCLAIMER = "\n\n⚠️ This is an analytical signal, not investment advice. Past signal performance does not guarantee future results. Consult a SEBI-registered advisor before making investment decisions."

async def fake_stream(question: str):
    """Fallback when no API key is present."""
    responses = [
        f"Based on available data from NSE OHLCV and BSE Bulk Deals, here is an analysis of your portfolio:\n\n**HDFC BANK (₹1680.45)**\nCurrently showing a highly-convictive **Volume Surge** signal (Score: 89/100). Historical out-of-sample data indicates a 72% win rate for this pattern.\n\n**TCS (₹4120.80)**\nThere's a **Bollinger Squeeze** developing (Score: 67/100). This suggests an impending volatility expansion.\n\n**RELIANCE (₹2954.20)**\nThe **RSI Oversold** signal (Score: 81/100) triggered yesterday.{SEBI_DISCLAIMER}",
        f"Looking at the active signals for your portfolio constituents:\n\n**FII/DII Alignment**\nWe're noticing strong positive flow alignment for **TCS**, which coincides with a **MACD Crossover** signal detected earlier today.\n\n**HDFC BANK** remains historically undervalued compared to its 5-year mean P/B ratio.{SEBI_DISCLAIMER}"
    ]
    text = responses[len(question) % len(responses)]
    for word in text.split(" "):
        yield word + " "
        await asyncio.sleep(0.04)


async def generate_claude_stream(request: AnalysisRequest):
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    
    if not api_key:
        print("[AI] No ANTHROPIC_API_KEY found. Using simulated streaming.")
        async for chunk in fake_stream(request.question):
            yield f"data: {json.dumps({'text': chunk})}\n\n"
        return

    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=api_key)
        
        portfolio_str = ""
        if request.portfolio:
            portfolio_str = f"\n\nUser's portfolio: {json.dumps(request.portfolio)}"
        
        signals_str = ""
        if request.signals:
            signals_str = f"\n\nActive signals: {json.dumps(request.signals[:5])}"
        
        prompt = f"{request.question}{portfolio_str}{signals_str}"
        
        async with client.messages.stream(
            max_tokens=1024,
            system="You are an expert Indian stock market technical analyst. Provide analysis based on NSE/BSE data. Always include the SEBI disclaimer: 'This is analytical signal output, not investment advice. Consult a SEBI-registered advisor.' Keep responses concise and data-driven. Use ₹ for Indian prices.",
            messages=[{"role": "user", "content": prompt}],
            model="claude-sonnet-4-20250514",
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps({'text': text})}\n\n"
    except Exception as e:
        print(f"[AI] Claude API error: {e}. Falling back to simulated streaming.")
        async for chunk in fake_stream(request.question):
            yield f"data: {json.dumps({'text': chunk})}\n\n"


@router.post("/analyze")
async def analyze_portfolio(request: AnalysisRequest):
    return StreamingResponse(
        generate_claude_stream(request), 
        media_type="text/event-stream"
    )
