import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function RadarScanOverlay({ onComplete }) {
  const [stocksScanned, setStocksScanned] = useState(0)
  const [signalsFound, setSignalsFound] = useState(0)
  const [detectedItems, setDetectedItems] = useState([])

  // Tick stocksScanned from 0 → 500 over 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocksScanned(prev => {
        if (prev >= 500) { clearInterval(interval); return 500 }
        return prev + Math.floor(Math.random() * 18) + 8 // variable speed feels real
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  // Pop in detected signals at random points during the scan
  const detectionTimings = [
    { delay: 400,  ticker: 'TATAMOTORS', signal: 'Volume Surge + Bulk Deal' },
    { delay: 780,  ticker: 'RELIANCE',   signal: 'Earnings Surprise +18%'   },
    { delay: 1100, ticker: 'HDFCBANK',   signal: 'RSI Oversold Bounce'       },
    { delay: 1450, ticker: 'INFOSYS',    signal: 'MACD Bullish Crossover'    },
    { delay: 1700, ticker: 'SBI',        signal: 'Promoter Buying Signal'    },
    { delay: 1950, ticker: 'TATAPOWER',  signal: 'Bollinger Squeeze'         },
  ]
  useEffect(() => {
    detectionTimings.forEach(({ delay, ticker, signal }) => {
      setTimeout(() => {
        setDetectedItems(prev => [...prev, { ticker, signal, id: Date.now() + delay }])
        setSignalsFound(prev => prev + 1)
      }, delay)
    })
    // Complete callback
    setTimeout(onComplete, 2600)
  }, [onComplete])

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,10,15,0.96)', backdropFilter: 'blur(10px)'
      }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
    >
      <style>
        {`
          @keyframes radarSpinFast {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `}
      </style>
      
      {/* Animated radar circle overlaying background */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15, pointerEvents: 'none' }}>
        <div style={{ width: 600, height: 600, borderRadius: '50%', border: '1px solid var(--accent-gold)' }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, borderRadius: '50%',
          background: 'conic-gradient(transparent 270deg, var(--accent-gold) 360deg)',
          animation: 'radarSpinFast 1.5s linear infinite',
          transformOrigin: 'center center'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 480, padding: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent-gold)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="live-pulse-dot" style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-gold)' }} />
          Scanning NSE Universe...
        </h2>

        {/* Progress bar */}
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
          <motion.div
            style={{ background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-gold))', height: '100%' }}
            animate={{ width: `${(stocksScanned / 500) * 100}%` }}
            transition={{ ease: 'linear', duration: 0.05 }}
          />
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: 13 }}>
          {stocksScanned} / 500 stocks analysed
        </p>

        {/* Signal counter */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', fontSize: 44, fontWeight: 800 }}>{signalsFound}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>high-probability signals detected</span>
        </div>

        {/* Live detection feed */}
        <div style={{ marginTop: 24, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {detectedItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}
              >
                <span style={{ color: 'var(--accent-teal)' }}>●</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 700, width: 95 }}>{item.ticker}</span>
                <span style={{ color: 'var(--text-secondary)' }}>— {item.signal}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
