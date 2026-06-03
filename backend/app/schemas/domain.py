from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class PortfolioItemBase(BaseModel):
    ticker: str
    avg_price: float
    quantity: int

class PortfolioItemCreate(PortfolioItemBase):
    pass

class PortfolioItemResponse(PortfolioItemBase):
    id: UUID
    class Config:
        from_attributes = True

class PrecedentResponse(BaseModel):
    id: UUID
    date: str
    trigger_price: float
    outcome_10d_pct: str
    won: bool
    class Config:
        from_attributes = True

class MarketSignalResponse(BaseModel):
    id: UUID
    ticker: str
    signal_type: str
    signal_score: int
    win_rate: int
    convergence_score: Optional[float] = None
    detected_at: datetime
    precedents: List[PrecedentResponse] = []
    class Config:
        from_attributes = True
