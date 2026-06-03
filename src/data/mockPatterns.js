const now = new Date();
const formatDate = (daysAgo) => {
  const d = new Date(now.getTime() - daysAgo * 86400000);
  // Ensure it's a weekday for the mock data mapping
  if (d.getDay() === 0) d.setDate(d.getDate() - 2);
  if (d.getDay() === 6) d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const mockPatterns = {
  TATAMOTORS: [
    {
      type: 'Bollinger Squeeze',
      startDate: formatDate(40),
      endDate: formatDate(25),
      highPrice: 980,
      lowPrice: 890,
      winRate: 67,
      outcome: '+8.4%',
    },
    {
      type: 'Volume Surge',
      startDate: formatDate(15),
      endDate: formatDate(10),
      highPrice: 1020,
      lowPrice: 910,
      winRate: 72,
      outcome: 'ACTIVE',
    },
    {
      type: 'RSI Oversold',
      startDate: formatDate(70),
      endDate: formatDate(65),
      highPrice: 920,
      lowPrice: 850,
      winRate: 61,
      outcome: '+5.1%',
    },
  ],
  RELIANCE: [
    {
      type: 'Earnings Surprise',
      startDate: formatDate(35),
      endDate: formatDate(28),
      highPrice: 1050,
      lowPrice: 960,
      winRate: 74,
      outcome: '+9.7%',
    },
  ],
  HDFCBANK: [
    {
      type: 'MACD Crossover',
      startDate: formatDate(20),
      endDate: formatDate(14),
      highPrice: 990,
      lowPrice: 920,
      winRate: 69,
      outcome: 'ACTIVE',
    }
  ]
};

export const signalColors = {
  'RSI Oversold':           '#FF6B6B',
  'MACD Crossover':         '#FFD93D',
  'Bollinger Squeeze':      '#FF8C42',
  'Volume Surge':           '#6BCB77',
  'Earnings Surprise':      '#4D96FF',
  'Bulk Deal Cluster':      '#C77DFF',
  'Promoter Buying':        '#FF85A1',
  'Insider Trade':          '#00E5FF',
};
