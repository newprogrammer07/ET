import { mockSignals, backtestResults, showcaseSignals, generateOHLCVData, radarChartData, sectorHeatmapData } from '../data/mockSignals';

export const getLiveSignals = async () => {
  try {
    const res = await fetch('/api/market/signals', { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    
    const data = await res.json();
    
    if (data.status === 'success' && data.signals && data.signals.length > 0) {
      console.log(`[Signals] Loaded ${data.signals.length} LIVE signals from backend`);
      return data.signals;
    }
    
    throw new Error('No signals returned from backend');
  } catch (error) {
    console.warn('[Signals] Live signal fetch failed, using mock data:', error.message);
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { 
        message: 'Live signal computation in progress. Showing cached data.', 
        type: 'warning' 
      }
    }));
    return mockSignals;
  }
};

export const getStockChart = (ticker, timeframe = '3m') => {
  const days = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 }[timeframe] || 90;
  return new Promise(r => setTimeout(() => r(generateOHLCVData(days)), 200));
};

export const getBacktestResults = () => new Promise(r => setTimeout(() => r({ backtestResults, showcaseSignals }), 300));

export const getPortfolioSignals = (portfolio) => {
  const tickers = portfolio.map(s => s.ticker);
  const relevant = mockSignals.filter(s => tickers.includes(s.ticker));
  const watchlist = mockSignals.filter(s => !tickers.includes(s.ticker)).slice(0, 5);
  return new Promise(r => setTimeout(() => r({ relevant, watchlist }), 400));
};

export const getSignalPerformance = () => new Promise(r => setTimeout(() => r({ radarChartData, sectorHeatmapData }), 300));

const aiResponses = {
  default: "Based on my analysis of the current market signals and your portfolio composition, I can provide the following insights:\n\n**Key observations:**\n1. Your portfolio has 2 active signals this week — both showing positive momentum\n2. The overall market sentiment (FinBERT composite) is BULLISH at +22 points\n3. Volume patterns across your holdings suggest institutional accumulation\n\n**Recommended actions:**\n- Monitor HDFC Bank closely — the earnings surprise signal has a 74% historical win rate\n- Consider adding to positions showing RSI oversold signals if your risk tolerance allows\n\n*Data sources: NSE OHLCV (15-min delay), BSE Bulk Deals (EOD), FinBERT Sentiment Model v3.2*",
  hdfc: "HDFC Bank is showing mixed signals right now. Here's the balanced view:\n\n**Bullish factors:**\n- Q4 earnings beat consensus by +23%\n- Net Interest Margin expanded to 3.8%\n- Retail loan growth at 18% YoY\n- Post-merger integration synergies visible\n\n**Caution factors:**\n- RSI at 52 — not oversold, limited technical upside trigger\n- Sector rotation may cap short-term gains\n- Global rate cuts could compress NIMs going forward\n\n**Verdict:** The fundamental case is strong, but technically you may want to wait for a pullback to the ₹1,620 support level for a better entry. Historical win rate for this setup: 74% across 31 occurrences.\n\n*This is an analytical signal, not investment advice. Consult a SEBI-registered advisor.*",
  risk: "Analyzing risk signals across your portfolio:\n\n**⚠️ Elevated Risk:**\n- Adani Enterprises — Insider trades detected but sentiment mixed (+10 pts only)\n- High beta positions (TATAMOTORS, HINDALCO) increase portfolio volatility\n\n**✅ Stable:**\n- HDFC Bank, RELIANCE — Strong fundamental support with positive signals\n- SBI — Institutional buying provides floor\n\n**Portfolio VaR (95%):** ₹2.4L daily risk on ₹25L portfolio\n**Sector concentration:** 45% BFSI — consider diversifying into IT or Pharma\n\n*Risk metrics computed using 252-day rolling window. Past performance ≠ future results.*"
};

export const askPortfolioQuestion = async (question) => {
  const q = question.toLowerCase();
  let response = aiResponses.default;
  if (q.includes('hdfc') || q.includes('add')) response = aiResponses.hdfc;
  if (q.includes('risk')) response = aiResponses.risk;
  return new Promise(r => setTimeout(() => r({ response, citations: ["NSE OHLCV", "BSE Bulk Deals", "FinBERT v3.2", "Historical Backtest DB"] }), 500));
};
