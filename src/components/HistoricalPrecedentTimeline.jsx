import { motion } from 'framer-motion'
import { mockPrecedents } from '../data/mockPrecedents'
import { signalTypeMap } from '../data/mockSignals'

export function HistoricalPrecedentTimeline({ signal }) {
  const precedents = mockPrecedents[signal.ticker]?.[signal.signalType] || []

  if (!precedents.length) {
    return (
      <div className="glass card-3d" style={{ borderRadius: 16, padding: 20 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-teal)', marginBottom: 8, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Historical Triggers
        </h4>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
          No extended historical timeline available for {signal.ticker}.
        </div>
      </div>
    )
  }

  const typeLabel = signalTypeMap[signal.signalType]?.label || signal.signalType

  return (
    <div className="glass card-3d" style={{ borderRadius: 16, padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-teal)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
          Historical Triggers
        </h4>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>
          {signal.winRate}% win rate · {signal.historicalOccurrences} occurrences
        </span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="hide-scrollbar" style={{ overflowX: 'auto', paddingBottom: 8, margin: '0 -4px' }}>
        <div style={{ display: 'flex', gap: 12, width: 'max-content', padding: '0 4px' }}>
          {precedents.map((p, i) => (
            <motion.div
              key={p.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                flexShrink: 0, width: 130, borderRadius: 12, padding: 12,
                background: p.won ? 'rgba(0,230,118,0.05)' : 'rgba(255,82,82,0.05)',
                border: `1px solid ${p.won ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`
              }}
            >
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', margin: '0 0 6px 0' }}>
                {p.date}
              </p>
              
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)', margin: '0 0 8px 0', fontWeight: 600 }}>
                ₹{p.triggerPrice} → ₹{p.exitPrice}
              </p>

              <div style={{
                textAlign: 'center', padding: '4px 0', borderRadius: 6, fontSize: 12, fontWeight: 800,
                background: p.won ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)',
                color: p.won ? 'var(--accent-green)' : 'var(--accent-red)',
                marginBottom: 6
              }}>
                {p.outcome} {p.won ? '✓' : '✗'}
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
                {p.daysToTarget} days out
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary line */}
      <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 12, fontStyle: 'italic', lineHeight: 1.5 }}>
        Win rate for <span style={{ color: 'var(--accent-gold)' }}>{typeLabel}</span> on{' '}
        <span style={{ color: 'var(--accent-gold)' }}>{signal.ticker}</span> specifically — 
        not generalised across all stocks.
      </p>
    </div>
  )
}
