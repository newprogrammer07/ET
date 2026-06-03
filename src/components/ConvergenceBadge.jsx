import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

// Human-readable signal type labels
const SIGNAL_LABELS = {
  volume_surge_breakout:  'Volume Surge',
  bulk_deal_cluster:      'Bulk Deal',
  rsi_oversold:           'RSI Oversold',
  macd_crossover:         'MACD Cross',
  bollinger_breakout:     'Bollinger Squeeze',
  earnings_surprise:      'Earnings Beat',
  promoter_buying:        'Promoter Buy',
  insider_trade_buy:      'Insider Buy',
  fifty_two_week_high:    '52W Breakout',
  sentiment_shift:        'Sentiment Shift',
}

export default function ConvergenceBadge({ signal }) {
  // Only render if 2 or more signal types are converging
  if (!signal.convergenceSignals || signal.convergenceSignals.length < 2) {
    return null
  }

  const signalLabels = signal.convergenceSignals.map(
    type => SIGNAL_LABELS[type] || type
  )

  return (
    <motion.div
      className="convergence-badge"
      initial={{ opacity: 0, scale: 0.85, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
    >
      {/* Pulsing glow ring behind the badge */}
      <div className="convergence-glow-ring" />

      {/* Badge content */}
      <div className="convergence-inner">
        <div className="convergence-header">
          <Zap size={12} className="convergence-zap" />
          <span className="convergence-title">MULTI-SIGNAL CONVERGENCE</span>
          <Zap size={12} className="convergence-zap" />
        </div>

        <div className="convergence-signals-row">
          {signalLabels.map((label, i) => (
            <span key={i} className="convergence-signal-tag">
              {label}
            </span>
          ))}
        </div>

        <div className="convergence-win-boost">
          <span className="convergence-base">Base win rate: {signal.winRate}%</span>
          <span className="convergence-arrow">→</span>
          <span className="convergence-elevated">
            Elevated: {signal.convergenceWinRate}%
          </span>
          <span className="convergence-boost-label">
            +{signal.convergenceWinRate - signal.winRate}pts when signals align
          </span>
        </div>
      </div>
    </motion.div>
  )
}
