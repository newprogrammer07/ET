# 🚀 OpportunityRadar — ET AI Hackathon 2026

OpportunityRadar is a full-stack, AI-driven institutional-grade stock market analysis platform built for the everyday Indian investor. Designed for the **ET Markets AI Hackathon 2026 (PS6)**, it bridges the gap between retail traders and quantitative analysts by leveraging live market data, advanced technical patterns, and natural language sentiment analysis (Claude AI).

The project is structured into two main tiers:
1. **Frontend**: A high-performance, polished React 18 application emphasizing real-time data visualization, dynamic SVGs, and institutional aesthetics.
2. **Backend**: A hyper-fast Python FastAPI server backed by asynchronous PostgreSQL, driving user authentication, portfolio management, database-stored chart signals, and Server-Sent Events (SSE) AI chatting.

---

## 🏗️ Technical Architecture

### The Frontend (React + Vite)
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS with raw variables (Glassmorphism & animations)
- **Data Fetching**: `@tanstack/react-query`
- **Charting**: Lightweight Charts (TradingView) + Recharts + Custom SVGs
- **Animation**: Framer Motion

### The Backend (FastAPI + Python)
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL (Relational DB)
- **ORM**: SQLAlchemy (Async) + Alembic for migrations
- **Authentication**: JWT (JSON Web Tokens) with `python-jose` and `passlib[bcrypt]`
- **Validation**: Pydantic models for absolute type safety

---

## ⚡ How to Start & Run Everything

You need to run both the Frontend and the Backend servers simultaneously for the full end-to-end experience.

### 1. Starting the Python FastAPI Backend

The backend requires Python 3.10+ and a local installation of PostgreSQL.

**Step 1: Setup the Database**
Ensure PostgreSQL is running locally on your machine (`localhost:5432`) and create a database named `opportunity_radar`.
```bash
# If using psql
psql -U postgres
CREATE DATABASE opportunity_radar;
```

**Step 2: Initialize the Python Environment**
Navigate to the `backend` directory, create a virtual environment, and install all dependencies.

**Option A: Using Standard Python (`venv`)**
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
# (or if no requirements.txt, run):
# pip install fastapi uvicorn sqlalchemy asyncpg alembic pydantic pydantic-settings python-jose passlib[bcrypt] python-multipart
```

**Option B: Using Anaconda / Miniconda**
If you prefer Anaconda, you can create and activate a conda environment instead:
```bash
cd backend
conda create -n opportunity_radar python=3.10 -y
conda activate opportunity_radar

pip install -r requirements.txt
# (or if no requirements.txt, run the pip install command from Option A)
```

**Step 3: Run Database Migrations**
We use Alembic to create the tables natively.
```bash
alembic upgrade head
```

**Step 4: Launch the Server**
Boot up the `uvicorn` ASGI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The backend API is now running at `http://127.0.0.1:8000`. You can test it by visiting `http://127.0.0.1:8000/docs` to see the automated Swagger UI.*

---

### 2. Starting the React Frontend

The frontend runs independently on Vite and proxies request calls to the FastAPI backend.

**Step 1: Install Dependencies**
Open a *new* terminal window (leave the FastAPI server running in the other). Navigate to the project root:
```bash
# Ensure you are in the root directory (not the backend folder)
npm install
```

**Step 2: Start the Development Server**
Launch the Vite React application:
```bash
npm run dev
```
*The frontend is now running at `http://localhost:5173`. Open this URL in your browser.*

---

## 🌟 The Core Differentiators & Hackathon Fixes

OpportunityRadar isn't just a screener; it is a **convergence engine**. 
While most platforms give you raw RSI or MACD metrics independently, OpportunityRadar natively calculates when multiple distinct signals fire simultaneously on the same asset.

### Stand-out Features Implemented:
1. **Multi-Signal Convergence Badges (`ConvergenceBadge.jsx`)**: When stocks trigger multiple conditions (e.g., *Volume Surge + Bulk Deals*), the platform natively flashes an electric-gold convergence tag, dynamically boosting the historical win-rate multiplier.
2. **AI Source Citation Badges (`CitationBadges.jsx`)**: Institutional investors demand data attribution. Every message synthesized by the "Portfolio AI Advisor" is post-pended with precise, hoverable citation pills mapping back to the explicit data source (NSE OHLCV, BSE Bulk Deals, SEBI Disclosures). Includes hardcoded SEBI warnings.
3. **Advanced SVG Pattern Bounding Boxes (`PatternOverlay.jsx`)**: The basic TradingView charts have been explicitly overridden. Using a complex `ResizeObserver` feeding into `timeScale()` and `priceScale()` hook logic, the charts now automatically draw explicitly sized SVG bounding boxes precisely highlighting the detected candlestick formations (Breakouts, Reversals) with dynamic tooltips.
4. **The "Judge Mode" Resilience Engine System (`DemoContext`)**: A robust UI state manager containing a hidden `?mode=judge-demo` URL flag to ensure seamless execution during live pitches even under extreme network duress or API lags.

---

### 📂 File Map & Key Architecture

```text
OpportunityRadar/
├── backend/                       # Python FastAPI Application
│   ├── alembic/                   # Database Migrations
│   ├── app/
│   │   ├── api/                   # FastAPI Endpoints (auth.py, deps.py)
│   │   ├── core/                  # Database connections & JWT Security Configs
│   │   ├── models/                # SQLAlchemy Async ORM Definitions
│   │   └── schemas/               # Pydantic validation shapes
│   └── main.py                    # Uvicorn entrypoint
│
├── src/                           # React Frontend Application
│   ├── api/                       # Service calls to Python (claude.js, signals.js)
│   ├── components/                # React components (CitationBadges, Radars)
│   ├── data/                      # Client-side Mock Data Engine (Failover)
│   └── pages/                     # Primary Views (OpportunityRadar, PortfolioIntelligence)
│
├── index.html                     # Vite Entry
└── package.json                   # Node modules
```

*OpportunityRadar is strictly built for the ET Solutions Hackathon requirements. Ensure you consult a SEBI registered entity before executing real market orders.*
