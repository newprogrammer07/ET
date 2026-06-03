export const mockPrecedents = {
  TATAMOTORS: {
    volume_surge_breakout: [
      { date: 'Aug 14 \'23', triggerPrice: 612,  exitPrice: 722,  outcome: '+18.2%', won: true,  daysToTarget: 7  },
      { date: 'Mar 02 \'23', triggerPrice: 441,  exitPrice: 484,  outcome: '+9.7%',  won: true,  daysToTarget: 10 },
      { date: 'Oct 19 \'22', triggerPrice: 389,  exitPrice: 373,  outcome: '-4.1%',  won: false, daysToTarget: 10 },
      { date: 'Jun 08 \'22', triggerPrice: 402,  exitPrice: 460,  outcome: '+14.3%', won: true,  daysToTarget: 9  },
      { date: 'Jan 24 \'22', triggerPrice: 487,  exitPrice: 525,  outcome: '+7.8%',  won: true,  daysToTarget: 6  },
    ],
  },
  RELIANCE: {
    earnings_surprise: [
      { date: 'Jan 13 \'25', triggerPrice: 1264, exitPrice: 1387, outcome: '+9.7%',  won: true,  daysToTarget: 8  },
      { date: 'Oct 14 \'24', triggerPrice: 2847, exitPrice: 3168, outcome: '+11.3%', won: true,  daysToTarget: 10 },
      { date: 'Jul 22 \'24', triggerPrice: 3021, exitPrice: 2944, outcome: '-2.5%',  won: false, daysToTarget: 10 },
      { date: 'Apr 22 \'24', triggerPrice: 2912, exitPrice: 3180, outcome: '+9.2%',  won: true,  daysToTarget: 7  },
    ],
  },
  HDFCBANK: {
    rsi_oversold: [
      { date: 'Feb 28 \'25', triggerPrice: 1642, exitPrice: 1741, outcome: '+6.0%',  won: true,  daysToTarget: 9  },
      { date: 'Nov 04 \'24', triggerPrice: 1589, exitPrice: 1702, outcome: '+7.1%',  won: true,  daysToTarget: 8  },
      { date: 'Aug 05 \'24', triggerPrice: 1521, exitPrice: 1488, outcome: '-2.2%',  won: false, daysToTarget: 10 },
      { date: 'May 13 \'24', triggerPrice: 1478, exitPrice: 1610, outcome: '+8.9%',  won: true,  daysToTarget: 6  },
    ],
  },
}
