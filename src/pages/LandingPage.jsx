import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { AnimatedNumber } from '../components/Shared'
import { Sun, Moon, ArrowRight, BarChart3, Brain, Shield, TrendingUp, Zap, Target, Users, ChevronRight, Star, Radio } from 'lucide-react'

function Section({ children, className = '', style = {} }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }} className={className} style={style}>
      {children}
    </motion.section>
  )
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [sipAmount, setSipAmount] = useState(7100)
  const years = 25
  const rate = 0.12
  const months = years * 12
  const futureVal = sipAmount * ((Math.pow(1 + rate / 12, months) - 1) / (rate / 12)) * (1 + rate / 12)

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Landing Nav */}
      <nav className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '12px 32px', borderBottom: '1px solid var(--border-subtle)', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 32, height: 32 }}>
              <svg viewBox="0 0 40 40" style={{ width: 32, height: 32 }}>
                <circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.4" />
                <circle cx="20" cy="20" r="12" fill="none" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.6" />
                <circle cx="20" cy="20" r="2" fill="var(--accent-gold)" />
              </svg>
              <div className="radar-sweep" style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 32, borderRadius: '50%',
                background: 'conic-gradient(transparent 270deg, rgba(245,166,35,0.2) 315deg, rgba(245,166,35,0.6) 360deg)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>
              <span style={{ color: 'var(--accent-gold)' }}>Opportunity</span><span style={{ color: 'var(--text-primary)' }}>Radar</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { label: 'Signals', to: '/dashboard' },
                { label: 'Charts', to: '/dashboard/chart-patterns' },
                { label: 'Backtest', to: '/dashboard/historical-proof' },
                { label: 'AI Advisor', to: '/dashboard/portfolio' }
              ].map(item => (
                <Link key={item.label} to={item.to} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>{item.label}</Link>
              ))}
            </div>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <div className="theme-toggle-knob" />
              <Moon size={12} style={{ position: 'absolute', left: 6, top: 8, color: theme === 'dark' ? '#0A0A0F' : 'var(--text-muted)', transition: 'color 0.3s' }} />
              <Sun size={12} style={{ position: 'absolute', right: 6, top: 8, color: theme === 'light' ? '#fff' : 'var(--text-muted)', transition: 'color 0.3s' }} />
            </button>
            <Link to="/signin" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/signup" className="landing-btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="landing-hero bg-grid" style={{ paddingTop: 80 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="float-gentle" style={{
              position: 'absolute', width: 300 + i * 100, height: 300 + i * 100, borderRadius: '50%',
              border: `1px solid rgba(245,166,35,${0.04 + i * 0.02})`,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.5}s`
            }} />
          ))}
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="badge badge-new" style={{ marginBottom: 20, fontSize: 11 }}>🚀 AI-POWERED SIGNAL DETECTION</div>
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
              Detect Opportunities
              <br /><span style={{ color: 'var(--accent-gold)' }}>Before the Market Moves</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Scan 500 NSE stocks across 12 signal types. AI-powered signals with back-tested win rates. Built for 14 crore Indian retail investors.
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Link to="/signup" className="landing-btn-primary" style={{ fontSize: 15 }}>
                Start Free <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="landing-btn-secondary" style={{ fontSize: 15 }}>
                View Live Demo
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
              {[{ val: '500', label: 'Stocks Scanned' }, { val: '67.8%', label: 'Avg Win Rate' }, { val: '12', label: 'Signal Types' }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: 'var(--accent-gold)' }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative' }}>
            {/* Hero Signal Card Preview */}
            <div className="card-3d gradient-border" style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 28, border: '1px solid var(--border-card)', boxShadow: '0 20px 80px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="badge badge-volume">📊 Volume Surge</span>
                <span className="badge badge-new">NEW ●</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Tata Motors</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>NSE: TATAMOTORS</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="live-price-pulse" style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800 }}>₹924.50</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-green)', fontWeight: 600 }}>▲ +2.3%</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                SCORE: <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: 16 }}>89</span>/100 &nbsp;•&nbsp; Win Rate: <span style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>72%</span> (41 cases)
              </div>
              <div style={{ height: 6, background: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.5, delay: 0.8 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-gold))', borderRadius: 3 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                <div>RSI: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>34 ↑</span></div>
                <div>Sentiment: <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>+22pts</span></div>
                <div>Volume: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>2.8×</span></div>
                <div>Earnings: <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Beat +18%</span></div>
              </div>
            </div>
            {/* Floating mini cards */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ position: 'absolute', top: -20, right: -15, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '8px 14px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>HDFC Bank</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent-green)' }}>+23% Beat</div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              style={{ position: 'absolute', bottom: -10, left: -20, background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '8px 14px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>Reliance</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent-teal)' }}>RSI: 28 ↑</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* STATS BAR */}
      <Section className="landing-section" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { value: 500, label: 'NSE Stocks Scanned Daily', suffix: '+', color: 'var(--accent-gold)' },
            { value: 67.8, label: 'Average Signal Win Rate', suffix: '%', color: 'var(--accent-teal)', decimals: 1 },
            { value: 4800, label: 'Signals Generated (6 Months)', suffix: '+', color: 'var(--accent-green)' },
            { value: 63.7, label: 'Out-of-Sample Accuracy', suffix: '%', color: 'var(--accent-gold)', decimals: 1 }
          ].map((stat, i) => (
            <div key={i} className="metric-card card-3d" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: stat.color }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} duration={2} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* SIMPLIFIED DATA - ET Money inspired */}
      <Section className="landing-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              <span style={{ fontStyle: 'italic' }}>Simplified signals</span> for<br />amplified returns
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              You win at investing when you make sense of complex data. OpportunityRadar presents all the useful signals in the most simplified manner that helps you separate the investing opportunities from the noise.
            </p>
            <Link to="/signup" className="landing-btn-primary">
              Explore Signals <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* Funnel visualization */}
            <div style={{ position: 'relative', width: 300, height: 320 }}>
              <svg viewBox="0 0 300 320" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="funnel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <motion.path d="M 50 30 L 250 30 L 200 130 L 180 200 L 170 280 L 130 280 L 120 200 L 100 130 Z"
                  fill="url(#funnel)" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.4"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ duration: 1 }} />
                <motion.text x="150" y="60" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>500 Stocks</motion.text>
                <motion.text x="150" y="150" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>12 Signal Types</motion.text>
                <motion.text x="150" y="260" textAnchor="middle" fill="var(--accent-gold)" fontSize="13" fontFamily="var(--font-mono)" fontWeight="800"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>Top Opportunities</motion.text>
              </svg>
              {/* Floating icons */}
              {['📊', '📈', '💰', '🎯', '🔍'].map((icon, i) => (
                <motion.div key={i} className="float-gentle" style={{
                  position: 'absolute', fontSize: 24,
                  top: [10, 40, 20, 60, 5][i], left: [10, 260, 270, 5, 140][i],
                  animationDelay: `${i * 0.7}s`
                }}>{icon}</motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* SIP GROWTH - ET Money inspired */}
      <Section className="landing-section" style={{ background: theme === 'light' ? '#f0f7ff' : 'var(--bg-secondary)', borderRadius: 0, maxWidth: '100%', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div className="glass" style={{ borderRadius: 20, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Monthly SIP</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>₹ {sipAmount.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>In {years} years</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: 'var(--accent-teal)' }}>₹{(futureVal / 10000000).toFixed(2)} Cr</div>
              </div>
            </div>
            <input type="range" min="1000" max="50000" step="500" value={sipAmount}
              onChange={e => setSipAmount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-teal)', marginBottom: 24 }} />
            {/* Growth chart */}
            <svg viewBox="0 0 400 120" style={{ width: '100%', height: 120 }}>
              <defs>
                <linearGradient id="sipGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-teal)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--accent-teal)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path d="M 0 110 Q 100 105 200 80 T 400 10" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
              <path d="M 0 110 Q 100 105 200 80 T 400 10 L 400 120 L 0 120 Z" fill="url(#sipGrad)" />
              <text x="10" y="118" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">Today</text>
              <text x="350" y="118" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">{years} yrs later</text>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: 'var(--accent-teal)' }}>
              Get there where you want with Suitable signals
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
              Whoever you are and wherever you want to reach in life, OpportunityRadar's AI-powered, data-driven signal detection helps you get there with clarity and confidence.
            </p>
            <Link to="/signup" className="landing-btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-teal-dim))', boxShadow: '0 4px 20px rgba(0,229,255,0.2)' }}>
              Explore Signals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Section>

      {/* INVESTOR PERSONALITY - ET Money inspired */}
      <Section className="landing-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 360 }}>
              {[
                { type: 'STRATEGIZER', risk: '40-65', color: 'var(--accent-gold)', icon: '♟️' },
                { type: 'PROTECTOR', risk: '30-55', color: 'var(--accent-teal)', icon: '🛡️' },
                { type: 'RESEARCHER', risk: '45-60', color: 'var(--accent-green)', icon: '🔬' },
                { type: 'AGGRESSOR', risk: '60-85', color: 'var(--signal-rsi)', icon: '⚡' }
              ].map((p, i) => (
                <motion.div key={p.type} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="card-3d" style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 6 }}>{p.type}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 6, padding: '3px 8px', display: 'inline-block' }}>
                    Risk Score: {p.risk}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              Bring advantage of your <span style={{ color: 'var(--accent-gold)' }}>personality</span> to investing
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Success in your story happens when you know what you are doing and why. Bring an edge to your investing by taking decisions that match with your investor personality.
            </p>
            <Link to="/signup" className="landing-btn-primary">
              Take the FREE assessment <ArrowRight size={18} />
            </Link>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} /> 3,00,000+ assessments taken so far...
            </p>
          </div>
        </div>
      </Section>

      {/* FEATURES GRID */}
      <Section id="features" className="landing-section" style={{ background: theme === 'light' ? '#faf8f5' : 'var(--bg-secondary)', maxWidth: '100%', padding: '80px 24px', borderRadius: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Everything you need to <span style={{ color: 'var(--accent-gold)' }}>invest smarter</span></h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>Powered by AI, validated by back-testing, trusted by data.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: <Target size={28} />, title: 'Opportunity Radar', desc: 'Scan 500 NSE stocks across 12 signal types with real-time detection and scoring.', color: 'var(--accent-gold)' },
              { icon: <BarChart3 size={28} />, title: 'Chart Pattern Intelligence', desc: 'TradingView-grade candlestick charts with automated pattern overlays and win-rate data.', color: 'var(--accent-teal)' },
              { icon: <Shield size={28} />, title: 'Historical Proof', desc: 'Back-tested across 5 years of data. Out-of-sample validation at 63.7% accuracy.', color: 'var(--accent-green)' },
              { icon: <Brain size={28} />, title: 'AI Portfolio Advisor', desc: 'Ask questions about your portfolio in plain English. Get AI-powered analysis with source citations.', color: 'var(--signal-bulk)' },
              { icon: <Zap size={28} />, title: '12 Signal Types', desc: 'RSI, MACD, Bollinger, Volume Surge, Earnings Surprise, Bulk Deals, Insider Trades, and more.', color: 'var(--signal-macd)' },
              { icon: <Radio size={28} />, title: 'Real-Time Monitoring', desc: 'Live signal updates with market-aware confidence scoring. VIX-adjusted reliability metrics.', color: 'var(--signal-rsi)' }
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="card-3d gradient-border"
                style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 28, border: '1px solid var(--border-card)', cursor: 'pointer' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${f.color}15`, color: f.color, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FREEDOM TO CHOOSE - ET Money inspired */}
      <Section className="landing-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 400, background: 'linear-gradient(135deg, var(--accent-green), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#fff', padding: 40 }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🎯</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>AI-Powered</h3>
              <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>Our algorithms continuously scan the market to find hidden opportunities</p>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: 'var(--accent-teal)' }}>
              Invest in the freedom to choose
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Wealth is not just about money. It's about what all you can do with it. It is having your own story of progress. And living it every single day.
            </p>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
              So go ahead, imagine a future you want to shape.
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>
              And make it happen.
            </p>
            <Link to="/signup" className="landing-btn-primary" style={{ padding: '16px 40px', fontSize: 16, borderRadius: 30, background: 'var(--accent-teal)', boxShadow: '0 4px 20px rgba(0,229,255,0.3)' }}>
              Get started
            </Link>
          </div>
        </div>
      </Section>

      {/* SOCIAL PROOF */}
      <Section className="landing-section" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40 }}>Trusted by investors who demand more</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { quote: "OpportunityRadar flagged TATA MOTORS 3 weeks before my analyst did. The signal was spot-on with 18% returns.", name: "Arjun M.", role: "Active Trader, Mumbai", rating: 5 },
            { quote: "The back-tested win rates gave me confidence to act on signals. 67% accuracy is better than any screener I've used.", name: "Priya S.", role: "SIP Investor, Bangalore", rating: 5 },
            { quote: "Finally, a tool that explains WHY a signal matters. The AI narration is incredibly helpful for decision-making.", name: "Rahul K.", role: "Portfolio Manager, Delhi", rating: 5 }
          ].map((t, i) => (
            <div key={i} className="card-3d" style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 28, border: '1px solid var(--border-card)', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />)}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA SECTION */}
      <Section style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.1), rgba(0,229,255,0.1))', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Ready to detect your next opportunity?</h2>
        <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Join thousands of Indian investors using AI-powered signal detection.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Link to="/signup" className="landing-btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>Get Started Free <ArrowRight size={18} /></Link>
          <Link to="/dashboard" className="landing-btn-secondary" style={{ padding: '16px 40px', fontSize: 16 }}>View Live Demo</Link>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-secondary)', padding: '40px 24px 24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <svg viewBox="0 0 40 40" style={{ width: 24, height: 24 }}>
                  <circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.4" />
                  <circle cx="20" cy="20" r="2" fill="var(--accent-gold)" />
                </svg>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--accent-gold)' }}>OpportunityRadar</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>AI-powered stock signal detection for Indian retail investors.</p>
            </div>
            {[
              { title: 'Product', links: ['Signals', 'Chart Patterns', 'Backtest', 'AI Advisor'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Terms', 'Privacy', 'SEBI Compliance', 'Disclaimer'] }
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent-gold)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="sebi-disclaimer" style={{ marginBottom: 16 }}>
            ⚠️ <strong>SEBI Compliance:</strong> OpportunityRadar provides analytical signals for informational purposes only. This is NOT investment advice. Past signal performance does not guarantee future results. Consult a SEBI-registered advisor before investing.
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            © 2026 OpportunityRadar. Built for ET AI Hackathon 2026.
          </div>
        </div>
      </footer>
    </div>
  )
}
