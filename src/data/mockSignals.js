const rawSignals = [
  {
    id: "sig_001", ticker: "TATAMOTORS", companyName: "Tata Motors Limited", sector: "Automobiles", exchange: "NSE",
    currentPrice: 924.50, priceChange: 2.3, signalType: "volume_surge_breakout", signalScore: 89, winRate: 72,
    historicalOccurrences: 41, confidence: "HIGH", isNew: true,
    convergenceSignals: ['volume_surge_breakout', 'bulk_deal_cluster', 'rsi_oversold'], convergenceWinRate: 84,
    detectedAt: "2026-03-24T09:45:00+05:30",
    indicators: { rsi: 34, rsiTrend: "rising", macd: "positive", volume: "2.8x", sentiment: "+22pts", bulkDeals: "Price ₹340Cr FII", earningsSurprise: "+18%" },
    historicalPrecedent: { date: "2025-08-14", triggerPrice: 612, outcome10d: "+18.2%", won: true, daysToTarget: 7 },
    claudeNarration: "Tata Motors is showing a rare convergence of volume surge and RSI recovery from oversold territory. Volume exceeded 2.8× the 20-day average while price closed above the 52-week resistance level. FII institutions purchased ₹340Cr in bulk deals, signaling strong institutional confidence. The last time this exact combination occurred in August 2025, the stock rallied 18.2% within 10 trading days.",
    dataSources: ["NSE OHLCV", "BSE Bulk Deals 22/03/26", "Yahoo Finance Earnings"],
    radarScores: { patternStrength: 88, historicalWinRate: 72, volumeConfirmation: 92, fundamentalAlignment: 75, sentimentScore: 80 }
  },
  {
    id: "sig_002", ticker: "RELIANCE", companyName: "Reliance Industries Limited", sector: "Energy", exchange: "NSE",
    currentPrice: 2847.30, priceChange: 1.8, signalType: "rsi_oversold", signalScore: 85, winRate: 68,
    historicalOccurrences: 35, confidence: "HIGH", isNew: true,
    detectedAt: "2026-03-24T10:15:00+05:30",
    indicators: { rsi: 28, rsiTrend: "rising", macd: "neutral", volume: "1.5x", sentiment: "+15pts", bulkDeals: "—", earningsSurprise: "+8%" },
    historicalPrecedent: { date: "2025-10-14", triggerPrice: 2640, outcome10d: "+11.3%", won: true, daysToTarget: 9 },
    claudeNarration: "Reliance Industries has entered RSI oversold territory at 28, a level that historically precedes significant bounces. The Jio platforms division continues to show strong subscriber growth, and refining margins remain healthy.",
    dataSources: ["NSE OHLCV", "Moneycontrol Technicals", "SEBI SAST Disclosure"],
    radarScores: { patternStrength: 82, historicalWinRate: 68, volumeConfirmation: 65, fundamentalAlignment: 88, sentimentScore: 75 }
  },
  {
    id: "sig_003", ticker: "INFY", companyName: "Infosys Limited", sector: "IT", exchange: "NSE",
    currentPrice: 1567.85, priceChange: -0.8, signalType: "macd_crossover", signalScore: 82, winRate: 64,
    historicalOccurrences: 52, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-24T11:30:00+05:30",
    indicators: { rsi: 45, rsiTrend: "flat", macd: "bullish_cross", volume: "1.2x", sentiment: "+8pts", bulkDeals: "—", earningsSurprise: "+5%" },
    historicalPrecedent: { date: "2025-11-22", triggerPrice: 1420, outcome10d: "+7.8%", won: true, daysToTarget: 8 },
    claudeNarration: "Infosys shows a MACD bullish crossover with the signal line crossing above zero. Large deal pipeline remains robust with $4.2B in TCV last quarter.",
    dataSources: ["NSE OHLCV", "Infosys Q3 Results", "TCS Benchmark"],
    radarScores: { patternStrength: 75, historicalWinRate: 64, volumeConfirmation: 58, fundamentalAlignment: 82, sentimentScore: 70 }
  },
  {
    id: "sig_004", ticker: "HDFCBANK", companyName: "HDFC Bank Limited", sector: "BFSI", exchange: "NSE",
    currentPrice: 1689.25, priceChange: 0.5, signalType: "earnings_surprise", signalScore: 87, winRate: 74,
    historicalOccurrences: 31, confidence: "HIGH", isNew: true,
    convergenceSignals: ['earnings_surprise', 'promoter_buying'], convergenceWinRate: 79,
    detectedAt: "2026-03-24T09:30:00+05:30",
    indicators: { rsi: 52, rsiTrend: "rising", macd: "positive", volume: "1.8x", sentiment: "+28pts", bulkDeals: "Price ₹180Cr DII", earningsSurprise: "+23%" },
    historicalPrecedent: { date: "2025-07-18", triggerPrice: 1540, outcome10d: "+9.4%", won: true, daysToTarget: 6 },
    claudeNarration: "HDFC Bank reported Q4 earnings that beat consensus estimates by 23%. Net interest margin expanded to 3.8%, and retail loan growth remained strong at 18% YoY. The merger integration synergies are beginning to reflect in operating metrics.",
    dataSources: ["NSE OHLCV", "BSE Bulk Deals 21/03/26", "HDFC Bank Q4 FY26"],
    radarScores: { patternStrength: 80, historicalWinRate: 74, volumeConfirmation: 78, fundamentalAlignment: 92, sentimentScore: 88 }
  },
  {
    id: "sig_005", ticker: "SBIN", companyName: "State Bank of India", sector: "BFSI", exchange: "NSE",
    currentPrice: 812.40, priceChange: 3.1, signalType: "bulk_deal_cluster", signalScore: 81, winRate: 69,
    historicalOccurrences: 38, confidence: "HIGH", isNew: false,
    detectedAt: "2026-03-24T14:00:00+05:30",
    indicators: { rsi: 48, rsiTrend: "rising", macd: "neutral", volume: "2.1x", sentiment: "+12pts", bulkDeals: "₹520Cr FII cluster", earningsSurprise: "+11%" },
    historicalPrecedent: { date: "2025-09-05", triggerPrice: 720, outcome10d: "+8.6%", won: true, daysToTarget: 10 },
    claudeNarration: "SBI has seen a cluster of bulk deals totaling ₹520Cr from FII buyers over the past 3 sessions. This concentrated institutional buying often precedes positive price momentum.",
    dataSources: ["NSE OHLCV", "BSE Bulk Deals Cluster", "SEBI FII Data"],
    radarScores: { patternStrength: 76, historicalWinRate: 69, volumeConfirmation: 85, fundamentalAlignment: 72, sentimentScore: 68 }
  },
  {
    id: "sig_006", ticker: "TCS", companyName: "Tata Consultancy Services", sector: "IT", exchange: "NSE",
    currentPrice: 3845.60, priceChange: -1.2, signalType: "bollinger_breakout", signalScore: 78, winRate: 67,
    historicalOccurrences: 19, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-23T15:00:00+05:30",
    indicators: { rsi: 38, rsiTrend: "flat", macd: "negative", volume: "1.4x", sentiment: "-5pts", bulkDeals: "—", earningsSurprise: "+3%" },
    historicalPrecedent: { date: "2025-12-10", triggerPrice: 3620, outcome10d: "+5.2%", won: true, daysToTarget: 8 },
    claudeNarration: "TCS is approaching the lower Bollinger Band with a squeeze pattern forming, suggesting an imminent volatility breakout. Historically, downside squeezes at this level have resolved to the upside.",
    dataSources: ["NSE OHLCV", "TCS Q3 Results"],
    radarScores: { patternStrength: 72, historicalWinRate: 67, volumeConfirmation: 62, fundamentalAlignment: 78, sentimentScore: 55 }
  },
  {
    id: "sig_007", ticker: "BAJFINANCE", companyName: "Bajaj Finance Limited", sector: "BFSI", exchange: "NSE",
    currentPrice: 7234.15, priceChange: 1.5, signalType: "promoter_buying", signalScore: 84, winRate: 71,
    historicalOccurrences: 24, confidence: "HIGH", isNew: true,
    detectedAt: "2026-03-24T12:00:00+05:30",
    indicators: { rsi: 42, rsiTrend: "rising", macd: "positive", volume: "1.6x", sentiment: "+18pts", bulkDeals: "Promoter ₹92Cr", earningsSurprise: "+14%" },
    historicalPrecedent: { date: "2025-06-20", triggerPrice: 6850, outcome10d: "+6.8%", won: true, daysToTarget: 7 },
    claudeNarration: "Bajaj Finance promoters have increased their stake by purchasing ₹92Cr worth of shares in open market transactions. Promoter buying is one of the strongest signals of insider confidence.",
    dataSources: ["NSE OHLCV", "SEBI SAST Disclosure", "BSE Corporate Actions"],
    radarScores: { patternStrength: 80, historicalWinRate: 71, volumeConfirmation: 70, fundamentalAlignment: 85, sentimentScore: 82 }
  },
  {
    id: "sig_008", ticker: "ADANIENT", companyName: "Adani Enterprises Limited", sector: "Conglomerate", exchange: "NSE",
    currentPrice: 2456.80, priceChange: 4.2, signalType: "insider_trade", signalScore: 76, winRate: 62,
    historicalOccurrences: 28, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-23T16:00:00+05:30",
    indicators: { rsi: 55, rsiTrend: "rising", macd: "positive", volume: "2.3x", sentiment: "+10pts", bulkDeals: "₹145Cr insider", earningsSurprise: "+7%" },
    historicalPrecedent: { date: "2025-05-12", triggerPrice: 2180, outcome10d: "+12.7%", won: true, daysToTarget: 9 },
    claudeNarration: "Key insiders at Adani Enterprises have made significant open market purchases. Combined with strong volume and improving sentiment, this signals potential upside momentum.",
    dataSources: ["NSE OHLCV", "SEBI Insider Trading Disclosures"],
    radarScores: { patternStrength: 70, historicalWinRate: 62, volumeConfirmation: 80, fundamentalAlignment: 65, sentimentScore: 60 }
  },
  {
    id: "sig_009", ticker: "SUNPHARMA", companyName: "Sun Pharmaceutical Industries", sector: "Pharma", exchange: "NSE",
    currentPrice: 1234.90, priceChange: 0.9, signalType: "rsi_oversold", signalScore: 79, winRate: 65,
    historicalOccurrences: 33, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-24T13:00:00+05:30",
    indicators: { rsi: 30, rsiTrend: "rising", macd: "neutral", volume: "1.3x", sentiment: "+5pts", bulkDeals: "—", earningsSurprise: "+9%" },
    historicalPrecedent: { date: "2025-08-28", triggerPrice: 1100, outcome10d: "+7.1%", won: true, daysToTarget: 8 },
    claudeNarration: "Sun Pharma has dipped into RSI oversold territory following sector-wide selling pressure. Specialty business continues to grow at 15%+ YoY, providing fundamental support.",
    dataSources: ["NSE OHLCV", "Sun Pharma Q3 Results"],
    radarScores: { patternStrength: 74, historicalWinRate: 65, volumeConfirmation: 55, fundamentalAlignment: 80, sentimentScore: 62 }
  },
  {
    id: "sig_010", ticker: "MARUTI", companyName: "Maruti Suzuki India Limited", sector: "Automobiles", exchange: "NSE",
    currentPrice: 12456.30, priceChange: 1.1, signalType: "volume_surge_breakout", signalScore: 83, winRate: 70,
    historicalOccurrences: 27, confidence: "HIGH", isNew: true,
    detectedAt: "2026-03-24T10:45:00+05:30",
    indicators: { rsi: 40, rsiTrend: "rising", macd: "positive", volume: "2.4x", sentiment: "+16pts", bulkDeals: "₹210Cr MF", earningsSurprise: "+12%" },
    historicalPrecedent: { date: "2025-11-05", triggerPrice: 11200, outcome10d: "+8.9%", won: true, daysToTarget: 7 },
    claudeNarration: "Maruti Suzuki shows exceptional volume surge at 2.4x the 20-day average. Mutual fund buying of ₹210Cr signals strong domestic institutional support. February dispatches exceeded estimates.",
    dataSources: ["NSE OHLCV", "BSE Bulk Deals", "Maruti Monthly Dispatches"],
    radarScores: { patternStrength: 82, historicalWinRate: 70, volumeConfirmation: 88, fundamentalAlignment: 78, sentimentScore: 76 }
  },
  {
    id: "sig_011", ticker: "ICICIBANK", companyName: "ICICI Bank Limited", sector: "BFSI", exchange: "NSE",
    currentPrice: 1245.75, priceChange: 0.7, signalType: "macd_crossover", signalScore: 80, winRate: 66,
    historicalOccurrences: 44, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-23T14:30:00+05:30",
    indicators: { rsi: 50, rsiTrend: "flat", macd: "bullish_cross", volume: "1.1x", sentiment: "+10pts", bulkDeals: "—", earningsSurprise: "+15%" },
    historicalPrecedent: { date: "2025-09-18", triggerPrice: 1120, outcome10d: "+6.2%", won: true, daysToTarget: 10 },
    claudeNarration: "ICICI Bank is showing classical MACD bullish crossover. Asset quality remains best-in-class with GNPA at 2.1%, and digital banking adoption continues to drive efficiency gains.",
    dataSources: ["NSE OHLCV", "ICICI Bank Q3 Results"],
    radarScores: { patternStrength: 73, historicalWinRate: 66, volumeConfirmation: 52, fundamentalAlignment: 85, sentimentScore: 72 }
  },
  {
    id: "sig_012", ticker: "HINDALCO", companyName: "Hindalco Industries Limited", sector: "Metals", exchange: "NSE",
    currentPrice: 567.20, priceChange: 5.4, signalType: "volume_surge_breakout", signalScore: 86, winRate: 71,
    historicalOccurrences: 22, confidence: "HIGH", isNew: true,
    detectedAt: "2026-03-24T11:00:00+05:30",
    indicators: { rsi: 42, rsiTrend: "rising", macd: "positive", volume: "3.1x", sentiment: "+20pts", bulkDeals: "₹280Cr FII", earningsSurprise: "+16%" },
    historicalPrecedent: { date: "2025-07-30", triggerPrice: 480, outcome10d: "+14.5%", won: true, daysToTarget: 6 },
    claudeNarration: "Hindalco is seeing massive volume surge at 3.1x average, driven by rising global aluminum prices and strong Novelis performance. FII buying of ₹280Cr confirms institutional conviction.",
    dataSources: ["NSE OHLCV", "LME Aluminum Prices", "BSE Bulk Deals"],
    radarScores: { patternStrength: 85, historicalWinRate: 71, volumeConfirmation: 95, fundamentalAlignment: 76, sentimentScore: 78 }
  },
  {
    id: "sig_013", ticker: "WIPRO", companyName: "Wipro Limited", sector: "IT", exchange: "NSE",
    currentPrice: 478.35, priceChange: -0.4, signalType: "bollinger_breakout", signalScore: 74, winRate: 61,
    historicalOccurrences: 36, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-23T15:30:00+05:30",
    indicators: { rsi: 35, rsiTrend: "flat", macd: "neutral", volume: "1.1x", sentiment: "+3pts", bulkDeals: "—", earningsSurprise: "+2%" },
    historicalPrecedent: { date: "2025-10-25", triggerPrice: 430, outcome10d: "+4.8%", won: true, daysToTarget: 9 },
    claudeNarration: "Wipro is trading near the lower Bollinger Band with decreasing bandwidth, suggesting a squeeze breakout scenario. AI services segment showing promising pipeline growth.",
    dataSources: ["NSE OHLCV"],
    radarScores: { patternStrength: 68, historicalWinRate: 61, volumeConfirmation: 50, fundamentalAlignment: 70, sentimentScore: 58 }
  },
  {
    id: "sig_014", ticker: "LTIM", companyName: "LTIMindtree Limited", sector: "IT", exchange: "NSE",
    currentPrice: 5678.90, priceChange: 2.8, signalType: "earnings_surprise", signalScore: 88, winRate: 76,
    historicalOccurrences: 18, confidence: "HIGH", isNew: true,
    detectedAt: "2026-03-24T09:20:00+05:30",
    indicators: { rsi: 58, rsiTrend: "rising", macd: "positive", volume: "2.0x", sentiment: "+25pts", bulkDeals: "₹150Cr MF", earningsSurprise: "+28%" },
    historicalPrecedent: { date: "2025-07-15", triggerPrice: 5200, outcome10d: "+10.1%", won: true, daysToTarget: 5 },
    claudeNarration: "LTIMindtree delivered a stunning earnings beat of +28% driven by strong deal wins in cloud services. The merger synergies have accelerated with combined deal wins exceeding $1.8B TCV.",
    dataSources: ["NSE OHLCV", "LTIMindtree Q4 Results", "BSE Bulk Deals"],
    radarScores: { patternStrength: 86, historicalWinRate: 76, volumeConfirmation: 80, fundamentalAlignment: 90, sentimentScore: 85 }
  },
  {
    id: "sig_015", ticker: "TATASTEEL", companyName: "Tata Steel Limited", sector: "Metals", exchange: "NSE",
    currentPrice: 156.80, priceChange: 3.6, signalType: "bulk_deal_cluster", signalScore: 77, winRate: 63,
    historicalOccurrences: 42, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-24T13:30:00+05:30",
    indicators: { rsi: 44, rsiTrend: "rising", macd: "positive", volume: "1.9x", sentiment: "+8pts", bulkDeals: "₹420Cr FII+DII", earningsSurprise: "+6%" },
    historicalPrecedent: { date: "2025-12-02", triggerPrice: 138, outcome10d: "+9.3%", won: true, daysToTarget: 8 },
    claudeNarration: "Tata Steel has attracted ₹420Cr in combined FII and DII buying. European operations showing improved margins after restructuring. Steel prices rebounding globally.",
    dataSources: ["NSE OHLCV", "BSE Bulk Deals Cluster", "WorldSteel Data"],
    radarScores: { patternStrength: 72, historicalWinRate: 63, volumeConfirmation: 78, fundamentalAlignment: 68, sentimentScore: 64 }
  },
  {
    id: "sig_016", ticker: "BHARTIARTL", companyName: "Bharti Airtel Limited", sector: "Telecom", exchange: "NSE",
    currentPrice: 1534.20, priceChange: 0.3, signalType: "promoter_buying", signalScore: 80, winRate: 68,
    historicalOccurrences: 20, confidence: "HIGH", isNew: false,
    detectedAt: "2026-03-23T12:00:00+05:30",
    indicators: { rsi: 50, rsiTrend: "flat", macd: "neutral", volume: "1.2x", sentiment: "+14pts", bulkDeals: "Promoter ₹78Cr", earningsSurprise: "+10%" },
    historicalPrecedent: { date: "2025-08-08", triggerPrice: 1380, outcome10d: "+7.5%", won: true, daysToTarget: 8 },
    claudeNarration: "Bharti Airtel promoters have been consistently buying in the open market, totaling ₹78Cr this month. 5G subscriber base expanding rapidly, ARPU trajectory remains positive.",
    dataSources: ["NSE OHLCV", "SEBI SAST Disclosure", "TRAI Data"],
    radarScores: { patternStrength: 74, historicalWinRate: 68, volumeConfirmation: 56, fundamentalAlignment: 82, sentimentScore: 74 }
  },
  {
    id: "sig_017", ticker: "ASIANPAINT", companyName: "Asian Paints Limited", sector: "FMCG", exchange: "NSE",
    currentPrice: 2890.45, priceChange: -1.5, signalType: "rsi_oversold", signalScore: 75, winRate: 63,
    historicalOccurrences: 29, confidence: "MEDIUM", isNew: false,
    detectedAt: "2026-03-24T14:30:00+05:30",
    indicators: { rsi: 26, rsiTrend: "bottoming", macd: "negative", volume: "1.3x", sentiment: "-8pts", bulkDeals: "—", earningsSurprise: "-2%" },
    historicalPrecedent: { date: "2025-06-15", triggerPrice: 2650, outcome10d: "+5.8%", won: true, daysToTarget: 10 },
    claudeNarration: "Asian Paints RSI has reached 26 — deep oversold territory. While near-term margins face pressure from crude-linked raw materials, the brand premium and distribution moat remain intact.",
    dataSources: ["NSE OHLCV", "Asian Paints Q3 Results"],
    radarScores: { patternStrength: 70, historicalWinRate: 63, volumeConfirmation: 58, fundamentalAlignment: 72, sentimentScore: 48 }
  }
];

export const signalTypeMap = {
  volume_surge_breakout: { label: "Volume Surge", badge: "badge-volume", icon: "📊", color: "var(--signal-volume)" },
  rsi_oversold: { label: "RSI Oversold", badge: "badge-rsi", icon: "🔴", color: "var(--signal-rsi)" },
  macd_crossover: { label: "MACD Crossover", badge: "badge-macd", icon: "🟡", color: "var(--signal-macd)" },
  bollinger_breakout: { label: "Bollinger Breakout", badge: "badge-bollinger", icon: "🟠", color: "var(--signal-bollinger)" },
  earnings_surprise: { label: "Earnings Surprise", badge: "badge-earnings", icon: "🔵", color: "var(--signal-earnings)" },
  bulk_deal_cluster: { label: "Bulk Deal Cluster", badge: "badge-bulk", icon: "💜", color: "var(--signal-bulk)" },
  promoter_buying: { label: "Promoter Buying", badge: "badge-promoter", icon: "🩷", color: "var(--signal-promoter)" },
  insider_trade: { label: "Insider Trade", badge: "badge-insider", icon: "⚡", color: "var(--signal-insider)" }
};

export const sectors = ["All", "Automobiles", "IT", "BFSI", "Pharma", "FMCG", "Metals", "Energy", "Telecom", "Conglomerate"];

export const backtestResults = [
  { signalType: "Earnings Surprise", stocksTested: 487, totalTriggers: 312, winRate: 74, avgReturn: 5.8, bestCase: 31.2, worstCase: -8.1 },
  { signalType: "Volume Surge Breakout", stocksTested: 500, totalTriggers: 847, winRate: 72, avgReturn: 4.9, bestCase: 28.4, worstCase: -11.3 },
  { signalType: "Promoter Buying", stocksTested: 492, totalTriggers: 284, winRate: 71, avgReturn: 4.5, bestCase: 22.8, worstCase: -7.2 },
  { signalType: "Bulk Deal Cluster", stocksTested: 498, totalTriggers: 426, winRate: 69, avgReturn: 4.2, bestCase: 22.1, worstCase: -9.7 },
  { signalType: "RSI Oversold Bounce", stocksTested: 500, totalTriggers: 1243, winRate: 65, avgReturn: 3.8, bestCase: 24.6, worstCase: -12.5 },
  { signalType: "MACD Crossover", stocksTested: 500, totalTriggers: 1567, winRate: 64, avgReturn: 3.5, bestCase: 20.3, worstCase: -13.8 },
  { signalType: "Bollinger Breakout", stocksTested: 500, totalTriggers: 892, winRate: 67, avgReturn: 4.0, bestCase: 26.7, worstCase: -10.9 },
  { signalType: "Insider Trade", stocksTested: 485, totalTriggers: 356, winRate: 62, avgReturn: 3.2, bestCase: 18.5, worstCase: -11.1 }
];

export const showcaseSignals = [
  { company: "Reliance Industries", ticker: "RELIANCE", date: "Oct 14, 2025", signal: "RSI Oversold Bounce", triggerPrice: 2847, outcome: "+11.3%", outcomePrice: 3168, quote: "The system flagged this 3 weeks before most analysts published buy notes." },
  { company: "Tata Motors", ticker: "TATAMOTORS", date: "Aug 14, 2025", signal: "Volume Surge Breakout", triggerPrice: 612, outcome: "+18.2%", outcomePrice: 723, quote: "Volume surged 2.8× while the stock cleared 52-week resistance — a classic breakout setup." },
  { company: "HDFC Bank", ticker: "HDFCBANK", date: "Jul 18, 2025", signal: "Earnings Surprise +23%", triggerPrice: 1540, outcome: "+9.4%", outcomePrice: 1685, quote: "Post-merger earnings exceeded even the most bullish street estimate by ₹3.2 per share." },
  { company: "Hindalco Industries", ticker: "HINDALCO", date: "Jul 30, 2025", signal: "Volume Surge + FII Buying", triggerPrice: 480, outcome: "+14.5%", outcomePrice: 550, quote: "Global aluminum demand surge combined with ₹280Cr FII buying created an unmissable setup." },
  { company: "LTIMindtree", ticker: "LTIM", date: "Jul 15, 2025", signal: "Earnings Surprise +28%", triggerPrice: 5200, outcome: "+10.1%", outcomePrice: 5725, quote: "Cloud services deal wins propelled earnings far beyond consensus, signaling sector leadership." }
];

export const demoPortfolios = [
  { name: "Aggressive Trader", stocks: [{ ticker: "TATAMOTORS", qty: 100, avgPrice: 820 }, { ticker: "ADANIENT", qty: 25, avgPrice: 2200 }, { ticker: "HINDALCO", qty: 200, avgPrice: 500 }, { ticker: "BAJFINANCE", qty: 15, avgPrice: 6800 }] },
  { name: "SIP Investor", stocks: [{ ticker: "HDFCBANK", qty: 200, avgPrice: 1450 }, { ticker: "RELIANCE", qty: 50, avgPrice: 2600 }, { ticker: "TCS", qty: 30, avgPrice: 3500 }, { ticker: "INFY", qty: 80, avgPrice: 1400 }] },
  { name: "Dividend Investor", stocks: [{ ticker: "SBIN", qty: 300, avgPrice: 680 }, { ticker: "ICICIBANK", qty: 150, avgPrice: 1100 }, { ticker: "BHARTIARTL", qty: 60, avgPrice: 1350 }, { ticker: "TATASTEEL", qty: 500, avgPrice: 135 }] }
];

export const sectorHeatmapData = [
  { sector: "BFSI", signals: 8, marketCap: "₹48.2L Cr", topSignal: "HDFC Bank — Earnings Surprise", intensity: 0.9 },
  { sector: "IT", signals: 5, marketCap: "₹28.6L Cr", topSignal: "LTIMindtree — Earnings +28%", intensity: 0.6 },
  { sector: "Automobiles", signals: 4, marketCap: "₹12.4L Cr", topSignal: "Tata Motors — Volume Surge", intensity: 0.7 },
  { sector: "Metals", signals: 4, marketCap: "₹8.9L Cr", topSignal: "Hindalco — Volume Surge", intensity: 0.7 },
  { sector: "Energy", signals: 3, marketCap: "₹22.1L Cr", topSignal: "Reliance — RSI Oversold", intensity: 0.5 },
  { sector: "Pharma", signals: 2, marketCap: "₹10.5L Cr", topSignal: "Sun Pharma — RSI Oversold", intensity: 0.4 },
  { sector: "FMCG", signals: 2, marketCap: "₹14.8L Cr", topSignal: "Asian Paints — RSI Oversold", intensity: 0.3 },
  { sector: "Telecom", signals: 2, marketCap: "₹9.2L Cr", topSignal: "Bharti Airtel — Promoter Buy", intensity: 0.4 },
  { sector: "Infra", signals: 1, marketCap: "₹6.8L Cr", topSignal: "L&T — MACD Crossover", intensity: 0.2 },
  { sector: "Real Estate", signals: 1, marketCap: "₹3.2L Cr", topSignal: "DLF — Volume Surge", intensity: 0.2 },
  { sector: "Consumer", signals: 1, marketCap: "₹5.1L Cr", topSignal: "Titan — Bollinger Breakout", intensity: 0.15 }
];

export const radarChartData = [
  { type: "Earnings Surprise", winRate: 74, frequency: 312 },
  { type: "Volume Surge", winRate: 72, frequency: 847 },
  { type: "Promoter Buy", winRate: 71, frequency: 284 },
  { type: "Bulk Deal", winRate: 69, frequency: 426 },
  { type: "Bollinger", winRate: 67, frequency: 892 },
  { type: "RSI Oversold", winRate: 65, frequency: 1243 },
  { type: "MACD Cross", winRate: 64, frequency: 1567 },
  { type: "Insider Trade", winRate: 62, frequency: 356 }
];

export const generateOHLCVData = (days = 90) => {
  const data = [];
  let price = 900 + Math.random() * 100;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const time = new Date(now - i * 86400000);
    if (time.getDay() === 0 || time.getDay() === 6) continue;
    const change = (Math.random() - 0.48) * price * 0.03;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.01;
    const low = Math.min(open, close) - Math.random() * price * 0.01;
    const volume = Math.floor(1000000 + Math.random() * 5000000);
    data.push({ time: Math.floor(time.getTime() / 1000), open, high, low, close, volume });
    price = close;
  }
  return data;
};

export const mockSignals = rawSignals.map(signal => ({
  ...signal,
  scores: {
    patternStrength: signal.id === 'sig_001' ? 88 : Math.floor(65 + Math.random() * 30),
    historicalWinRate: signal.winRate,
    volumeConfirmation: signal.id === 'sig_001' ? 94 : Math.floor(60 + Math.random() * 35),
    fundamentalAlign: signal.id === 'sig_001' ? 71 : Math.floor(50 + Math.random() * 45),
    sentimentScore: signal.id === 'sig_001' ? 84 : Math.floor(55 + Math.random() * 40)
  }
}));
