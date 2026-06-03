import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getLiveSignals } from '../api/signals'
import { signalTypeMap, sectors } from '../data/mockSignals'
import { AnimatedNumber, RadarSvg, TypewriterText } from '../components/Shared'
import { SignalScoreRadar } from '../components/SignalScoreRadar'
import ConvergenceBadge from '../components/ConvergenceBadge'
import { HistoricalPrecedentTimeline } from '../components/HistoricalPrecedentTimeline'
import { useAppContext } from '../App'
import { Search, Filter, ArrowUpDown, Star, MessageSquare, TrendingUp, Eye, RefreshCw } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { RadarScanOverlay } from '../components/RadarScanOverlay'
import { LiveNewsFeed } from '../components/LiveNewsFeed'

export default function OpportunityRadar() {
  const { selectedSignal, setSelectedSignal } = useAppContext()
  const { scanActive, triggerScan } = useDemo()
  const [filters, setFilters] = useState({ types: [], sector: 'All', sort: 'score', highConviction: false })
  const [showRadar, setShowRadar] = useState(null)
  
  const { data: signals = [], isLoading } = useQuery({ queryKey: ['signals'], queryFn: getLiveSignals })

  const filtered = signals.filter(s => {
    if (filters.types.length > 0 && !filters.types.includes(s.signalType)) return false
    if (filters.sector !== 'All' && s.sector !== filters.sector) return false
    if (filters.highConviction && s.signalScore < 75) return false
    return true
  }).sort((a, b) => {
    if (filters.sort === 'score') return b.signalScore - a.signalScore
    if (filters.sort === 'winrate') return b.winRate - a.winRate
    if (filters.sort === 'date') return new Date(b.detectedAt) - new Date(a.detectedAt)
    return 0
  })

  useEffect(() => { if (filtered.length > 0 && !selectedSignal) setSelectedSignal(filtered[0]) }, [filtered])

  const toggleType = (type) => {
    setFilters(f => ({
      ...f,
      types: f.types.includes(type) ? f.types.filter(t => t !== type) : [...f.types, type]
    }))
  }

  return (
    <>
      <AnimatePresence>
        {scanActive && <RadarScanOverlay onComplete={() => {}} />}
      </AnimatePresence>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-200px)] w-full max-w-full">
        {/* Live News - Left Pane */}
        <div className="w-full lg:w-[24%] flex flex-col h-[400px] lg:h-auto">
          <LiveNewsFeed />
        </div>

        {/* Signal Feed - Middle Pane */}
      <div className="w-full lg:w-[44%] flex flex-col gap-4">
        {/* Summary Bar */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="metric-card card-3d gold">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Signals Today</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-gold)' }}>
              <AnimatedNumber value={signals.length} />
            </div>
          </div>
          <div className="metric-card card-3d teal">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Avg Win Rate</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-teal)' }}>
              <AnimatedNumber value={67.8} suffix="%" decimals={1} />
            </div>
          </div>
          <div className="metric-card card-3d green">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Stocks Scanned</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-green)' }}>
              <AnimatedNumber value={500} />
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}> / 500</span>
            </div>
            <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2, marginTop: 8 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-green), var(--accent-teal))', borderRadius: 2 }} />
            </div>
          </div>
          <div className="metric-card card-3d amber">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Market Mood</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-green)' }}>BULLISH 📈</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>FinBERT: +22pts</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass rounded-xl p-3 flex items-center gap-2 flex-wrap">
          <Filter size={14} color="var(--text-muted)" className="hidden md:block" />
          {Object.entries(signalTypeMap).map(([key, val]) => (
            <button key={key} onClick={() => toggleType(key)}
              className={`badge ${filters.types.includes(key) ? val.badge : ''}`}
              style={{ cursor: 'pointer', opacity: filters.types.length === 0 || filters.types.includes(key) ? 1 : 0.4, transition: 'all 0.2s', ...(!filters.types.includes(key) ? { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' } : {}) }}>
              {val.icon} {val.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2 items-center flex-wrap">
            <button onClick={triggerScan} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-teal)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              <RefreshCw size={12} /> RE-SCAN
            </button>
            <select value={filters.sector} onChange={e => setFilters(f => ({ ...f, sector: e.target.value }))}
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', maxWidth: 100 }}>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}>
              <option value="score">Score</option>
              <option value="winrate">Win Rate</option>
              <option value="date">Date</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={filters.highConviction} onChange={e => setFilters(f => ({ ...f, highConviction: e.target.checked }))}
                style={{ accentColor: 'var(--accent-gold)' }} />
              High Conviction (&gt;75)
            </label>
          </div>
        </div>

        {/* Signal Cards */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 180 }} />) :
            <AnimatePresence>
              {filtered.map((signal, i) => (
                <SignalCard key={signal.id} signal={signal} index={i}
                  isSelected={selectedSignal?.id === signal.id}
                  onClick={() => setSelectedSignal(signal)}
                  onShowRadar={() => setShowRadar(showRadar === signal.id ? null : signal.id)}
                  showRadar={showRadar === signal.id} />
              ))}
            </AnimatePresence>
          }
        </div>
      </div>

      {/* Preview Panel - Right Pane */}
      <div className="w-full lg:w-[32%]">
        {selectedSignal ? <PreviewPanel signal={selectedSignal} /> : (
          <div className="glass" style={{ borderRadius: 16, padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Eye size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Select a signal to preview</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

function SignalCard({ signal, index, isSelected, onClick, onShowRadar, showRadar }) {
  const { addToWatchlist, watchlist } = useAppContext()
  const typeInfo = signalTypeMap[signal.signalType]
  const inWatchlist = watchlist.includes(signal.ticker)

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
      animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`card-3d gradient-border`}
      onClick={onClick}
      style={{
        background: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
        border: isSelected ? '1px solid var(--border-active)' : '1px solid var(--border-card)',
        position: 'relative'
      }}
    >
      {/* Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge ${typeInfo.badge}`}>{typeInfo.icon} {typeInfo.label}</span>
          {signal.isNew && <span className="badge badge-new">NEW ●</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: signal.signalScore >= 85 ? 'rgba(245,166,35,0.2)' : signal.signalScore >= 75 ? 'rgba(0,229,255,0.15)' : 'rgba(144,144,168,0.15)',
            borderRadius: 8, padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
            color: signal.signalScore >= 85 ? 'var(--accent-gold)' : signal.signalScore >= 75 ? 'var(--accent-teal)' : 'var(--text-secondary)'
          }}>
            SCORE: <AnimatedNumber value={signal.signalScore} />/100
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{signal.companyName}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {signal.exchange}: {signal.ticker}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="live-price-pulse" style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700 }}>₹{signal.currentPrice.toLocaleString()}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: signal.priceChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
            {signal.priceChange >= 0 ? '▲' : '▼'} {signal.priceChange >= 0 ? '+' : ''}{signal.priceChange}% today
          </div>
        </div>
      </div>

      {/* Convergence Super Badge */}
      <ConvergenceBadge signal={signal} />

      {/* Win Rate Bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Win Rate</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--accent-gold)' }}>
            {signal.winRate}% <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({signal.historicalOccurrences} cases)</span>
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
          <div className="win-rate-bar" style={{ '--win-rate': `${signal.winRate}%` }} />
        </div>
      </div>

      {/* Indicators Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
        <div>RSI: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{signal.indicators.rsi} {signal.indicators.rsiTrend === 'rising' ? '↑' : '→'}</span></div>
        <div>Sentiment: <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{signal.indicators.sentiment}</span></div>
        <div>Volume: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{signal.indicators.volume}</span></div>
        <div>Earnings: <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{signal.indicators.earningsSurprise}</span></div>
      </div>

      {/* Expandable Radar */}
      <AnimatePresence>
        {showRadar && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Signal Score Breakdown</p>
            <SignalScoreRadar scores={signal.scores} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'var(--font-mono)' }}>Pattern: {signal.scores.patternStrength}</span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'var(--font-mono)' }}>Win Rate: {signal.scores.historicalWinRate}</span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'var(--font-mono)' }}>Volume: {signal.scores.volumeConfirmation}</span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'var(--font-mono)' }}>Fundament: {signal.scores.fundamentalAlign}</span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(245,166,35,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(245,166,35,0.2)', fontFamily: 'var(--font-mono)' }}>Sentiment: {signal.scores.sentimentScore}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={(e) => { e.stopPropagation(); onShowRadar() }}
          style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '8px 12px', color: 'var(--accent-teal)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.2s' }}>
          <TrendingUp size={13} /> VIEW CHART
        </button>
        <button style={{ flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '8px 12px', color: 'var(--accent-gold)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.2s' }}>
          <MessageSquare size={13} /> ASK AI
        </button>
        <button onClick={(e) => { e.stopPropagation(); addToWatchlist(signal.ticker) }}
          style={{ flex: 1, background: inWatchlist ? 'rgba(245,166,35,0.15)' : 'var(--bg-elevated)', border: `1px solid ${inWatchlist ? 'var(--accent-gold)' : 'var(--border-card)'}`, borderRadius: 8, padding: '8px 12px', color: inWatchlist ? 'var(--accent-gold)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.2s' }}>
          <Star size={13} fill={inWatchlist ? 'var(--accent-gold)' : 'none'} /> {inWatchlist ? 'WATCHING' : 'WATCHLIST'}
        </button>
      </div>
    </motion.div>
  )
}

function PreviewPanel({ signal }) {
  const typeInfo = signalTypeMap[signal.signalType]
  const [showNarration, setShowNarration] = useState(false)

  useEffect(() => {
    setShowNarration(false)
    const t = setTimeout(() => setShowNarration(true), 600)
    return () => clearTimeout(t)
  }, [signal.id])

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 24 }}>
      {/* Company Card */}
      <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{signal.companyName}</h3>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{signal.sector} • {signal.exchange}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: 'var(--accent-gold)' }}>₹{signal.currentPrice.toLocaleString()}</div>
          </div>
        </div>
        {/* Mini Chart Placeholder */}
        <div style={{
          height: 120, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <MiniChartSVG signal={signal} />
          <div style={{ position: 'absolute', right: 8, bottom: 8, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>30D OHLCV</div>
        </div>
      </div>

      {/* Historical Precedent */}
      <HistoricalPrecedentTimeline signal={signal} />

      {/* Claude AI Narration */}
      <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-gold)', marginBottom: 12, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🤖</span> AI Analysis
        </h4>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {showNarration ? <TypewriterText text={signal.claudeNarration} speed={15} /> : <span className="skeleton" style={{ display: 'block', height: 80 }} />}
        </div>
      </div>

      {/* Data Sources */}
      <div className="glass" style={{ borderRadius: 12, padding: 12 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Data Sources</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {signal.dataSources.map((src, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '3px 8px', color: 'var(--text-secondary)' }}>
              📊 {src}
            </span>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6 }}>
          OHLCV: 15-min delayed | Bulk Deals: EOD T+0
        </div>
      </div>
    </motion.div>
  )
}

function MiniChartSVG({ signal }) {
  const points = []
  const w = 340, h = 100
  let price = signal.currentPrice * 0.95
  for (let i = 0; i < 30; i++) {
    price += (Math.random() - 0.45) * signal.currentPrice * 0.015
    points.push({ x: (i / 29) * w, y: h - ((price - signal.currentPrice * 0.9) / (signal.currentPrice * 0.15)) * h })
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = pathD + ` L ${w} ${h} L 0 ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={areaD} fill="url(#chartGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
      <motion.path d={pathD} fill="none" stroke="var(--accent-gold)" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }} />
      {/* Signal trigger vertical line */}
      <line x1={w * 0.7} y1="0" x2={w * 0.7} y2={h} stroke="var(--accent-gold)" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
      <text x={w * 0.7 + 4} y="10" fill="var(--accent-gold)" fontSize="8" fontFamily="var(--font-mono)">Signal</text>
    </svg>
  )
}
