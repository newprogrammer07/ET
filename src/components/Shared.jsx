import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

export function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0, duration = 1.5, style = {} }) {
  const [display, setDisplay] = useState(0)
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v)
    })
    return () => controls.stop()
  }, [value])

  return (
    <span style={{ fontFamily: 'var(--font-mono)', ...style }}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}

export function RadarSvg({ size = 200, scores }) {
  const axes = ['Pattern', 'Win Rate', 'Volume', 'Fundamental', 'Sentiment']
  const cx = size / 2, cy = size / 2, r = size * 0.38
  const angleStep = (2 * Math.PI) / 5

  const getPoint = (index, value) => {
    const angle = angleStep * index - Math.PI / 2
    const dist = (value / 100) * r
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) }
  }

  const values = [scores.patternStrength, scores.historicalWinRate, scores.volumeConfirmation, scores.fundamentalAlignment, scores.sentimentScore]
  const points = values.map((v, i) => getPoint(i, v))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[20, 40, 60, 80, 100].map(level => {
        const pts = Array.from({ length: 5 }, (_, i) => getPoint(i, level))
        return <polygon key={level} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="var(--border-subtle)" strokeWidth="0.5" />
      })}
      {axes.map((label, i) => {
        const end = getPoint(i, 105)
        const labelPos = getPoint(i, 120)
        return (
          <g key={label}>
            <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--border-subtle)" strokeWidth="0.5" />
            <text x={labelPos.x} y={labelPos.y} fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" dominantBaseline="middle">{label}</text>
          </g>
        )
      })}
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="rgba(245,166,35,0.2)"
        stroke="var(--accent-gold)"
        strokeWidth="1.5"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--accent-gold)" />
      ))}
    </svg>
  )
}

export function TypewriterText({ text, speed = 20 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}

export function SkeletonCard({ height = 200 }) {
  return <div className="skeleton" style={{ height, width: '100%' }} />
}
