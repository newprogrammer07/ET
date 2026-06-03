import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getSignalPerformance } from '../api/signals'
import { AnimatedNumber } from '../components/Shared'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Activity, Zap, BarChart3, AlertTriangle, TrendingUp, Radio } from 'lucide-react'

const fiiDiiData = [
  { day: 'Mon', FII: 1200, DII: 800 },
  { day: 'Tue', FII: -400, DII: 1100 },
  { day: 'Wed', FII: 2100, DII: 300 },
  { day: 'Thu', FII: 800, DII: -200 },
  { day: 'Fri', FII: 1500, DII: 500 }
];

export default function SignalPerformance() {
  const { data, isLoading } = useQuery({ queryKey: ['performance'], queryFn: getSignalPerformance })
  const [hoveredSector, setHoveredSector] = useState(null)
  const vixValue = 18.4
  const showVixWarning = vixValue > 25

  if (isLoading) return <div className="skeleton" style={{ height: 600 }} />
  const { radarChartData, sectorHeatmapData } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* VIX Warning */}
      {showVixWarning && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="vix-warning" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={24} color="var(--accent-amber)" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--accent-amber)' }}>
              ⚠️ HIGH VOLATILITY DETECTED (VIX: {vixValue})
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              Signal reliability is reduced in volatile markets. Win rates shown are based on normal market conditions. All confidence scores adjusted downward by 30%.
            </div>
          </div>
        </motion.div>
      )}

      {/* Global Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Signals (30d)', value: 142, icon: <Zap size={20} />, color: 'var(--accent-gold)', suffix: '', decimals: 0, accent: 'gold' },
          { label: 'Overall Win Rate', value: 67.8, icon: <TrendingUp size={20} />, color: 'var(--accent-teal)', suffix: '%', decimals: 1, accent: 'teal', extra: 'vs Nifty +4.2%' },
          { label: 'Active Signals', value: 17, icon: <Radio size={20} />, color: 'var(--accent-green)', suffix: '', decimals: 0, accent: 'green' },
          { label: 'VIX India', value: vixValue, icon: <Activity size={20} />, color: 'var(--accent-amber)', suffix: '', decimals: 1, accent: 'amber', extra: vixValue <= 25 ? 'Reliability: HIGH' : 'Reliability: LOW' }
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 120 }}
            className={`metric-card card-3d ${card.accent}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{card.label}</div>
              <div style={{ color: card.color, opacity: 0.6 }}>{card.icon}</div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: card.color }}>
              <AnimatedNumber value={card.value} suffix={card.suffix} decimals={card.decimals} />
            </div>
            {card.extra && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{card.extra}</div>}
            {/* Mini sparkline */}
            <svg viewBox="0 0 80 20" style={{ width: 80, height: 20, marginTop: 8, opacity: 0.5 }}>
              <motion.path d="M 0 15 Q 10 10 20 12 T 40 8 T 60 5 T 80 3" fill="none" stroke={card.color} strokeWidth="1.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }} />
            </svg>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} color="var(--accent-gold)" /> Signal Type Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarChartData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="type" tick={{ fill: '#9090A8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <PolarRadiusAxis angle={90} tick={{ fill: '#5A5A72', fontSize: 9 }} />
              <Radar name="Win Rate" dataKey="winRate" stroke="var(--accent-gold)" fill="var(--accent-gold)" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Frequency" dataKey="frequency" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.1} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <span><span style={{ color: 'var(--accent-gold)' }}>●</span> Win Rate (%)</span>
            <span><span style={{ color: 'var(--accent-teal)' }}>●</span> Frequency (count)</span>
          </div>
        </motion.div>

        {/* Sector Heatmap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
            Sector Signal Heatmap
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {sectorHeatmapData.map((s, i) => (
              <div key={s.sector} className="heatmap-cell card-3d" style={{
                '--cell-index': i,
                background: `rgba(245,166,35,${0.05 + s.intensity * 0.25})`,
                border: `1px solid rgba(245,166,35,${0.1 + s.intensity * 0.3})`,
                position: 'relative'
              }}
                onMouseEnter={() => setHoveredSector(s.sector)}
                onMouseLeave={() => setHoveredSector(null)}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{s.sector}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800, color: 'var(--accent-gold)' }}>{s.signals}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>signals</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{s.marketCap}</div>

                {hoveredSector === s.sector && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'absolute', bottom: -30, left: 0, right: 0, zIndex: 20, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-teal)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    Top: {s.topSignal}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* VIX/Market Context */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass" style={{ borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Market Context & Signal Reliability
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>India VIX</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: vixValue <= 20 ? 'var(--accent-green)' : vixValue <= 25 ? 'var(--accent-amber)' : 'var(--accent-red)', marginTop: 8 }}>
              <AnimatedNumber value={vixValue} decimals={1} />
            </div>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
              {vixValue <= 15 ? 'Low volatility — highly reliable' : vixValue <= 20 ? 'Normal volatility — good conditions' : vixValue <= 25 ? 'Elevated — exercise caution' : 'High — signals less reliable'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px 20px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>FII/DII Cash Flow (Cr)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--accent-teal)' }}>■ FII</span>
                <span style={{ color: 'var(--accent-gold)' }}>■ DII</span>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 90 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fiiDiiData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#9090A8', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9090A8', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <Bar dataKey="FII" fill="var(--accent-teal)" radius={[2,2,0,0]} />
                  <Bar dataKey="DII" fill="var(--accent-gold)" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Signal Reliability</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-green)', marginTop: 8 }}>HIGH ✅</div>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>Low VIX + FII inflows = favorable conditions</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
