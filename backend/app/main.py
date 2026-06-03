from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, news, ai, market, chat

app = FastAPI(title="OpportunityRadar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(news.router, prefix="/api/news", tags=["news"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(market.router, prefix="/api/market", tags=["market"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
