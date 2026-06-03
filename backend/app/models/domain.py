from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    portfolios = relationship("Portfolio", back_populates="user")

class Portfolio(Base):
    __tablename__ = "portfolios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    ticker = Column(String, index=True, nullable=False)
    avg_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

    user = relationship("User", back_populates="portfolios")

class MarketSignal(Base):
    __tablename__ = "market_signals"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticker = Column(String, index=True, nullable=False)
    signal_type = Column(String, nullable=False)
    signal_score = Column(Integer, nullable=False)
    win_rate = Column(Integer, nullable=False)
    convergence_score = Column(Float, nullable=True)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    precedents = relationship("HistoricalPrecedent", back_populates="signal")

class HistoricalPrecedent(Base):
    __tablename__ = "historical_precedents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    signal_id = Column(UUID(as_uuid=True), ForeignKey("market_signals.id"))
    date = Column(String, nullable=False)
    trigger_price = Column(Float, nullable=False)
    outcome_10d_pct = Column(String, nullable=False)
    won = Column(Boolean, nullable=False)
    
    signal = relationship("MarketSignal", back_populates="precedents")
