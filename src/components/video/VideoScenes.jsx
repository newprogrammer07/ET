import { useEffect, useState } from 'react'

// ─── Inject CSS animations once ──────────────────────────────────────────────
// Uses a style tag so we don't need any extra CSS files or Tailwind classes

const VIDEO_CSS = `
  @keyframes vid-countup {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes vid-slidein {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes vid-fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes vid-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.75); }
  }
  @keyframes vid-scan {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(500%); }
  }
  @keyframes vid-barfill {
    from { width: 0%; }
    to   { width: var(--target-width); }
  }
`

function injectVideoCSS() {
  if (document.getElementById('or-video-css')) return
  const style = document.createElement('style')
  style.id = 'or-video-css'
  style.textContent = VIDEO_CSS
  document.head.appendChild(style)
}

// ─── Shared layout wrapper used by all 3 scenes ───────────────────────────────

function SceneWrapper({ children, active }) {
  useEffect(() => { injectVideoCSS() }, [])

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16 / 9',
      background: '#0A0A0F',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Syne', sans-serif",
    }}>
      {/* Brand watermark top-left */}
      <div style={{
        position: 'absolute', top: 18, left: 22,
        color: '#F5A623', fontSize: 13, fontWeight: 'bold',
        letterSpacing: '2px', opacity: 0.85,
        fontFamily: "'Syne', sans-serif",
      }}>
        OPPORTUNITYRADAR
      </div>

      {/* Live indicator top-right */}
      <div style={{
        position: 'absolute', top: 14, right: 20,
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(0,230,118,0.12)',
        border: '1px solid rgba(0,230,118,0.35)',
        borderRadius: 20, padding: '4px 12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, color: '#00E676',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#00E676', display: 'inline-block',
          animation: active ? 'vid-pulse 1.2s ease-in-out infinite' : 'none',
        }} />
        NSE LIVE
      </div>

      {/* Subtle horizontal scan line — gives "live data" feel */}
      {active && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '20%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.03), transparent)',
            animation: 'vid-scan 2.5s linear infinite',
          }} />
        </div>
      )}

      {children}
    </div>
  )
}

// ─── SCENE 1: Nifty 50 + Sensex overview ─────────────────────────────────────

export function Scene1({ data, active }) {
  // Animate Nifty counter from (value - 180) → value over 1.5 seconds
  const [displayValue, setDisplayValue] = useState(data.nifty - 180)

  useEffect(() => {
    if (!active) { setDisplayValue(data.nifty - 180); return }
    const start = Date.now()
    const duration = 1500
    const startVal = data.nifty - 180
    const endVal = data.nifty

    const frame = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(startVal + (endVal - startVal) * eased))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active, data.nifty])

  const isGreen = data.niftyChange >= 0

  return (
    <SceneWrapper active={active}>
      {/* Scene label bottom-left */}
      <div style={{
        position: 'absolute', bottom: 18, left: 22,
        color: '#3A3A52', fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1.5px',
      }}>
        MARKET OVERVIEW · SCENE 1 OF 3
      </div>

      {/* Main content */}
      <div style={{ textAlign: 'center' }}>
        {/* Index label */}
        <div style={{
          color: '#5A5A72', fontSize: 14, letterSpacing: '4px', marginBottom: 10,
          fontFamily: "'JetBrains Mono', monospace",
          animation: active ? 'vid-fadein 0.4s ease-out both' : 'none',
        }}>
          NIFTY 50
        </div>

        {/* Animated counter */}
        <div style={{
          color: '#E8E8F0', fontSize: 72, fontWeight: 'bold', lineHeight: 1,
          fontFamily: "'JetBrains Mono', monospace",
          animation: active ? 'vid-countup 0.5s ease-out both' : 'none',
        }}>
          {displayValue.toLocaleString('en-IN')}
        </div>

        {/* Change */}
        <div style={{
          color: isGreen ? '#00E676' : '#FF5252',
          fontSize: 30, fontWeight: 'bold', marginTop: 10,
          animation: active ? 'vid-fadein 0.7s ease-out both' : 'none',
        }}>
          {isGreen ? '▲' : '▼'} {Math.abs(data.niftyChange).toFixed(2)}%
        </div>
      </div>

      {/* Sensex secondary card — bottom right */}
      <div style={{
        position: 'absolute', bottom: 18, right: 22,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8, padding: '10px 16px', textAlign: 'right',
        animation: active ? 'vid-fadein 0.9s ease-out both' : 'none',
      }}>
        <div style={{
          color: '#5A5A72', fontSize: 10, letterSpacing: '2px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          SENSEX
        </div>
        <div style={{
          color: '#E8E8F0', fontSize: 22,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {data.sensex.toLocaleString('en-IN')}
        </div>
        <div style={{
          color: data.sensexChange >= 0 ? '#00E676' : '#FF5252',
          fontSize: 13,
        }}>
          {data.sensexChange >= 0 ? '+' : ''}{data.sensexChange.toFixed(2)}%
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─── SCENE 2: Top signal spotlight ───────────────────────────────────────────

const SIGNAL_COLORS = {
  volume_surge_breakout: '#6BCB77',
  rsi_oversold:          '#FF6B6B',
  rsi_oversold_bounce:   '#FF6B6B',
  macd_crossover:        '#FFD93D',
  macd_bullish_crossover:'#FFD93D',
  bollinger_breakout:    '#FF8C42',
  bollinger_squeeze:     '#FF8C42',
  earnings_surprise:     '#4D96FF',
  bulk_deal_cluster:     '#C77DFF',
  promoter_buying:       '#FF85A1',
  insider_trade:         '#00E5FF',
}

export function Scene2({ data, active }) {
  const sigColor = SIGNAL_COLORS[data.signal?.signalType] || '#F5A623'
  const winRate  = data.signal?.winRate || 72
  const label    = (data.signal?.signalType || 'signal').replace(/_/g, ' ').toUpperCase()

  return (
    <SceneWrapper active={active}>
      <div style={{
        position: 'absolute', bottom: 18, left: 22,
        color: '#3A3A52', fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1.5px',
      }}>
        TOP SIGNAL · SCENE 2 OF 3
      </div>

      <div style={{
        width: '78%',
        animation: active ? 'vid-slidein 0.4s ease-out both' : 'none',
      }}>
        {/* Signal type badge */}
        <div style={{
          display: 'inline-block',
          background: `${sigColor}1A`,
          border: `1px solid ${sigColor}55`,
          borderRadius: 20, padding: '4px 14px', marginBottom: 14,
          color: sigColor, fontSize: 11, letterSpacing: '1px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {label}
        </div>

        {/* Ticker + company */}
        <div style={{ color: '#E8E8F0', fontSize: 46, fontWeight: 'bold', lineHeight: 1, marginBottom: 4 }}>
          {data.signal?.ticker || 'TATAMOTORS'}
        </div>
        <div style={{ color: '#9090A8', fontSize: 15, marginBottom: 22 }}>
          {data.signal?.companyName || 'Tata Motors Limited'}
        </div>

        {/* Score row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
          <span style={{
            color: '#F5A623', fontSize: 52, fontWeight: 'bold',
            fontFamily: "'JetBrains Mono', monospace", lineHeight: 1,
          }}>
            {data.signal?.signalScore || 89}
          </span>
          <span style={{ color: '#5A5A72', fontSize: 20 }}>/100</span>
          <span style={{ color: '#9090A8', fontSize: 13, marginLeft: 8 }}>signal score</span>
        </div>

        {/* Win rate bar */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <span style={{
              color: '#9090A8', fontSize: 11, letterSpacing: '1px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              HISTORICAL WIN RATE
            </span>
            <span style={{
              color: '#00E5FF', fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {winRate}% · {data.signal?.historicalOccurrences || 41} triggers
            </span>
          </div>
          {/* Track */}
          <div style={{
            height: 6, background: 'rgba(255,255,255,0.07)',
            borderRadius: 3, overflow: 'hidden',
          }}>
            {/* Fill — animated */}
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #00E5FF, #F5A623)',
              borderRadius: 3,
              '--target-width': `${winRate}%`,
              animation: active ? 'vid-barfill 1s ease-out 0.4s both' : 'none',
              width: active ? undefined : '0%',
            }} />
          </div>
        </div>
      </div>
    </SceneWrapper>
  )
}

// ─── SCENE 3: FII/DII flows + closing ────────────────────────────────────────

export function Scene3({ data, active }) {
  // Animate bars growing from 0 to full height
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active) { setProgress(0); return }
    const start = Date.now()
    const duration = 1200

    const frame = () => {
      const elapsed = Date.now() - start
      const p = Math.min(elapsed / duration, 1)
      setProgress(1 - Math.pow(1 - p, 2)) // ease-out quad
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active])

  const maxVal  = Math.max(Math.abs(data.fii), Math.abs(data.dii), 1)
  const maxBarH = 130
  const fiiH    = (Math.abs(data.fii) / maxVal) * maxBarH * progress
  const diiH    = (Math.abs(data.dii) / maxVal) * maxBarH * progress
  const bothBuy = data.fii > 0 && data.dii > 0

  return (
    <SceneWrapper active={active}>
      <div style={{
        position: 'absolute', bottom: 18, left: 22,
        color: '#3A3A52', fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1.5px',
      }}>
        INSTITUTIONAL FLOWS · SCENE 3 OF 3
      </div>

      <div style={{ width: '80%' }}>
        {/* Header */}
        <div style={{
          color: '#F5A623', fontSize: 16, fontWeight: 'bold',
          letterSpacing: '2px', marginBottom: 6,
          fontFamily: "'JetBrains Mono', monospace",
          animation: active ? 'vid-fadein 0.3s ease-out both' : 'none',
        }}>
          INSTITUTIONAL FLOWS
        </div>
        <div style={{ color: '#5A5A72', fontSize: 12, marginBottom: 28 }}>
          Today's FII / DII net activity
        </div>

        {/* Bars */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 56,
          height: 160,
          marginBottom: 20,
        }}>
          {/* FII */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              color: '#4D96FF', fontSize: 18, fontWeight: 'bold',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              ₹{data.fii.toLocaleString('en-IN')} Cr
            </div>
            <div style={{
              width: 52, height: Math.max(fiiH, 3),
              background: '#4D96FF', borderRadius: '4px 4px 0 0',
            }} />
            <div style={{ color: '#9090A8', fontSize: 12 }}>FII</div>
          </div>

          {/* DII */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              color: '#00E5FF', fontSize: 18, fontWeight: 'bold',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              ₹{data.dii.toLocaleString('en-IN')} Cr
            </div>
            <div style={{
              width: 52, height: Math.max(diiH, 3),
              background: '#00E5FF', borderRadius: '4px 4px 0 0',
            }} />
            <div style={{ color: '#9090A8', fontSize: 12 }}>DII</div>
          </div>
        </div>

        {/* Insight callout — appears once bars finish growing */}
        {progress > 0.7 && (
          <div style={{
            background: bothBuy ? 'rgba(0,230,118,0.07)' : 'rgba(255,179,0,0.07)',
            borderLeft: `3px solid ${bothBuy ? '#00E676' : '#FFB300'}`,
            borderRadius: '0 8px 8px 0',
            padding: '10px 16px',
            color: '#E8E8F0', fontSize: 13,
            animation: 'vid-fadein 0.4s ease-out both',
          }}>
            {bothBuy
              ? '✓ Both FII and DII buying — strong institutional conviction'
              : data.fii > 0
              ? 'FII buying, DII cautious — mixed institutional signal'
              : 'FII selling — monitor closely for reversal signals'}
          </div>
        )}
      </div>

      {/* SEBI disclaimer at very bottom */}
      <div style={{
        position: 'absolute', bottom: 6, left: 0, right: 0, textAlign: 'center',
        color: '#2A2A3A', fontSize: 9,
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.5px',
      }}>
        ANALYTICAL CONTENT ONLY · NOT INVESTMENT ADVICE · SEBI REGISTERED ADVISOR REQUIRED
      </div>
    </SceneWrapper>
  )
}
