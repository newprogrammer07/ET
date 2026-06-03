import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Sun, Moon, Home, LogOut } from 'lucide-react'
import { useLiveMarket } from '../hooks/useLiveMarket'
import { useDemo } from '../context/DemoContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { isJudgeMode } = useDemo()
  const { niftyData, isMarketOpen, isLoading } = useLiveMarket()
  const navigate = useNavigate()

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const ist = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const displayMarketOpen = isJudgeMode ? true : isMarketOpen
  const timeStr = ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  const niftyVal = niftyData ? niftyData.value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '22,456.80'
  const niftyChange = niftyData ? (niftyData.change > 0 ? '+' : '') + niftyData.pctChange.toFixed(2) : '+0.82'
  const niftyColor = niftyData && niftyData.change < 0 ? 'var(--accent-red)' : 'var(--accent-green)'

  const handleSignOut = async () => {
    await logout()
    navigate('/')
  }

  const userInitial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <header className="glass" style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 12, marginRight: 8 }}>
            <Home size={16} /> Home
          </Link>
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <svg viewBox="0 0 40 40" style={{ width: 40, height: 40 }}>
              <circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.3" />
              <circle cx="20" cy="20" r="12" fill="none" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5" />
              <circle cx="20" cy="20" r="6" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.7" />
              <circle cx="20" cy="20" r="2" fill="var(--accent-gold)" />
            </svg>
            <div className="radar-sweep" style={{
              position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderRadius: '50%',
              background: 'conic-gradient(transparent 270deg, rgba(245,166,35,0.3) 315deg, rgba(245,166,35,0.8) 360deg)'
            }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--accent-gold)' }}>Opportunity</span>
              <span style={{ color: 'var(--text-primary)' }}>Radar</span>
            </h1>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>
              AI SIGNAL DETECTION
            </span>
          </div>
        </div>

        {/* Market Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={displayMarketOpen ? 'status-dot-live' : 'status-dot-closed'} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: displayMarketOpen ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 600 }}>
              NSE {displayMarketOpen ? 'LIVE' : 'CLOSED — Opens 9:15 AM'}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
            {timeStr} IST
          </span>
        </div>

        {/* Market Tickers + User + Theme Toggle */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>NIFTY 50</span>
            {isLoading && !niftyData ? (
              <span className="live-price-pulse skeleton-box" style={{ width: 60, height: 16, background: 'var(--border-subtle)' }}></span>
            ) : (
              <>
                <span className="live-price-pulse" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{niftyVal}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: niftyColor, fontWeight: 600 }}>{niftyData?.change > 0 ? '▲' : '▼'} {niftyChange}%</span>
              </>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>SENSEX</span>
            <span className="live-price-pulse" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>73,872.40</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-green)', fontWeight: 600 }}>▲ +0.74%</span>
          </motion.div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>Last scan: 2 min ago</div>

          {/* User Profile */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" referrerPolicy="no-referrer"
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent-gold)', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent-gold)',
                  background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--accent-gold)'
                }}>
                  {userInitial}
                </div>
              )}
              <div style={{ maxWidth: 110, overflow: 'hidden' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.displayName || 'Trader'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
              <button onClick={handleSignOut} title="Sign Out"
                style={{
                  background: 'none', border: '1px solid var(--border-card)', borderRadius: 8,
                  padding: '6px 8px', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red)'; e.currentTarget.style.color = 'var(--accent-red)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{ position: 'relative', flexShrink: 0 }}>
            <div className="theme-toggle-knob" />
            <Moon size={12} style={{ position: 'absolute', left: 6, top: 8, color: theme === 'dark' ? '#0A0A0F' : 'var(--text-muted)', transition: 'color 0.3s' }} />
            <Sun size={12} style={{ position: 'absolute', right: 6, top: 8, color: theme === 'light' ? '#fff' : 'var(--text-muted)', transition: 'color 0.3s' }} />
          </button>
        </div>
      </div>
    </header>
  )
}