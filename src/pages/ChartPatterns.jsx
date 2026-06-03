import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { mockSignals, generateOHLCVData } from '../data/mockSignals'
import { PatternOverlay } from '../components/PatternOverlay'
import { mockPatterns } from '../data/mockPatterns'

const stockList = [...new Set(mockSignals.map(s => ({ ticker: s.ticker, name: s.companyName, sector: s.sector })))].concat([
  { ticker: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
  { ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'BFSI' },
  { ticker: 'LT', name: 'Larsen & Toubro', sector: 'Infra' },
  { ticker: 'TITAN', name: 'Titan Company', sector: 'Consumer' },
  { ticker: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Cement' },
])

const patterns = [
  { type: 'RSI Oversold Bounce', date: 'Mar 14, 2026', winRate: 61, occurrences: 28, color: 'var(--signal-rsi)' },
  { type: 'Bollinger Squeeze Breakout', date: 'Feb 28, 2026', winRate: 67, occurrences: 19, color: 'var(--signal-bollinger)' },
  { type: 'Earnings Surprise +23%', date: 'Jan 13, 2026', winRate: 74, occurrences: 31, color: 'var(--signal-earnings)' },
  { type: 'MACD Bullish Cross', date: 'Dec 05, 2025', winRate: 64, occurrences: 44, color: 'var(--signal-macd)' },
  { type: 'Volume Surge 2.8×', date: 'Nov 18, 2025', winRate: 72, occurrences: 41, color: 'var(--signal-volume)' },
]

const timelineEvents = [
  { date: 'Mar 14', signal: 'RSI Oversold', price: '₹882', outcome: '+6.2%', won: true },
  { date: 'Feb 28', signal: 'Bollinger Squeeze', price: '₹910', outcome: '+4.8%', won: true },
  { date: 'Jan 13', signal: 'Earnings Beat', price: '₹856', outcome: '+9.1%', won: true },
  { date: 'Dec 05', signal: 'MACD Cross', price: '₹820', outcome: '-2.4%', won: false },
  { date: 'Nov 18', signal: 'Volume Surge', price: '₹798', outcome: '+12.3%', won: true },
  { date: 'Oct 22', signal: 'RSI Oversold', price: '₹760', outcome: '+8.7%', won: true },
]

export default function ChartPatterns() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState({ ticker: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobiles' })
  const [showDropdown, setShowDropdown] = useState(false)
  const [timeRange, setTimeRange] = useState('3m')
  const [overlays, setOverlays] = useState({ rsi: true, macd: true, bollinger: true, volume: true })
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 400 })
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  const filteredStocks = stockList.filter(s =>
    s.ticker.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  useEffect(() => {
    let chart, candleSeries
    const initChart = async () => {
      try {
        const { createChart } = await import('lightweight-charts')
        if (!chartRef.current) return
        chartRef.current.innerHTML = ''
        chart = createChart(chartRef.current, {
          width: chartRef.current.clientWidth,
          height: 400,
          layout: { background: { color: '#0F0F1A' }, textColor: '#9090A8', fontFamily: 'JetBrains Mono' },
          grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
          crosshair: { mode: 0, vertLine: { color: 'rgba(245,166,35,0.4)', labelBackgroundColor: '#F5A623' }, horzLine: { color: 'rgba(245,166,35,0.4)', labelBackgroundColor: '#F5A623' } },
          timeScale: { borderColor: 'rgba(255,255,255,0.06)', timeVisible: false },
          rightPriceScale: { borderColor: 'rgba(255,255,255,0.06)' }
        })
        
        candleSeries = chart.addCandlestickSeries({
          upColor: '#00E676', downColor: '#FF5252', borderUpColor: '#00E676', borderDownColor: '#FF5252',
          wickUpColor: '#00E676', wickDownColor: '#FF5252'
        })
        
        const days = { '1w': 7, '1m': 30, '3m': 90, '6m': 180, '1y': 365 }[timeRange] || 90
        const data = generateOHLCVData(days)
        
        // Animate data draw-in
        for (let i = 0; i < data.length; i++) {
          setTimeout(() => { try { candleSeries.update(data[i]) } catch(e) {} }, i * 5)
        }

        if (overlays.volume) {
          const volSeries = chart.addHistogramSeries({
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
          })
          chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } })
          volSeries.setData(data.map(d => ({ time: d.time, value: d.volume, color: d.close >= d.open ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)' })))
        }

        if (overlays.bollinger) {
          const upper = chart.addLineSeries({ color: 'rgba(77,150,255,0.4)', lineWidth: 1, lineStyle: 2 })
          const lower = chart.addLineSeries({ color: 'rgba(77,150,255,0.4)', lineWidth: 1, lineStyle: 2 })
          upper.setData(data.map(d => ({ time: d.time, value: d.high * 1.02 })))
          lower.setData(data.map(d => ({ time: d.time, value: d.low * 0.98 })))
        }

        chartInstance.current = chart
        const ro = new ResizeObserver((entries) => { 
          if (chartRef.current) {
            chart.applyOptions({ width: chartRef.current.clientWidth }) 
            setChartDimensions({ width: entries[0].contentRect.width, height: 400 })
          }
        })
        ro.observe(chartRef.current)
        if (chartRef.current) {
          setChartDimensions({ width: chartRef.current.clientWidth, height: 400 })
        }
        return () => ro.disconnect()
      } catch(e) { console.error('Chart error:', e) }
    }
    initChart()
    return () => { if (chart) { try { chart.remove() } catch(e) {} } }
  }, [selected, timeRange, overlays])

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Main Chart Area */}
      <div style={{ flex: '0 0 68%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <div className="glass" style={{ borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search size={18} color="var(--text-muted)" />
            <input value={query} onChange={e => { setQuery(e.target.value); setShowDropdown(true) }}
              onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search any NSE-listed stock..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-gold)', fontWeight: 600 }}>{selected.ticker}</span>
          </div>
          {showDropdown && query && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              {filteredStocks.map(s => (
                <div key={s.ticker} onClick={() => { setSelected(s); setQuery(''); setShowDropdown(false) }}
                  style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s', borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => e.target.style.background = 'var(--bg-card-hover)'} onMouseLeave={e => e.target.style.background = ''}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{s.ticker}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12, marginLeft: 12 }}>{s.name}</span>
                  </div>
                  <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: 10 }}>{s.sector}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Time Range + Overlays */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['1w', '1m', '3m', '6m', '1y'].map(t => (
              <button key={t} onClick={() => setTimeRange(t)}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
                  background: timeRange === t ? 'var(--accent-gold)' : 'var(--bg-elevated)',
                  color: timeRange === t ? '#0A0A0F' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries({ rsi: 'RSI', macd: 'MACD', bollinger: 'BB', volume: 'VOL' }).map(([key, label]) => (
              <button key={key} onClick={() => setOverlays(o => ({ ...o, [key]: !o[key] }))}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                  background: overlays[key] ? 'rgba(0,229,255,0.15)' : 'var(--bg-elevated)',
                  color: overlays[key] ? 'var(--accent-teal)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden', padding: 4, position: 'relative' }}>
          <div ref={chartRef} style={{ width: '100%', height: 400 }} />
          <PatternOverlay chartRef={chartInstance} patterns={mockPatterns[selected.ticker] || []} chartWidth={chartDimensions.width} chartHeight={chartDimensions.height} />
        </div>

        {/* Timeline */}
        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Signal Timeline — What Would This Have Told You?
          </h4>
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
            {timelineEvents.map((ev, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ flex: '0 0 auto', width: 140, position: 'relative', padding: '0 8px' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: ev.won ? 'var(--accent-green)' : 'var(--accent-red)', margin: '0 auto', boxShadow: ev.won ? '0 0 8px rgba(0,230,118,0.5)' : '0 0 8px rgba(255,82,82,0.5)', position: 'relative', zIndex: 2 }} />
                {i < timelineEvents.length - 1 && <div style={{ position: 'absolute', top: 6, left: '50%', width: '100%', height: 1, background: 'var(--border-subtle)' }} />}
                <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{ev.date}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{ev.signal}</div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{ev.price}</div>
                  <div style={{ color: ev.won ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700, marginTop: 4 }}>
                    {ev.outcome} {ev.won ? '✅' : '❌'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Sidebar */}
      <div style={{ flex: '0 0 30%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--accent-gold)' }}>●</span> Detected Patterns
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {patterns.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="card-3d"
                style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600 }}>{p.type}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Detected: {p.date}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Win Rate: <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{p.winRate}%</span> ({p.occurrences} occurrences)
                </div>
                <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${p.winRate}%`, background: `linear-gradient(90deg, ${p.color}, var(--accent-gold))`, borderRadius: 2, transition: 'width 0.8s ease' }} />
                </div>
                <button onClick={() => chartInstance.current?.timeScale().scrollToPosition(-20, true)} style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-teal)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Jump to Date →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
