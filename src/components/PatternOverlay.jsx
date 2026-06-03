import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const PATTERN_COLORS = {
  bollinger_breakout:     '#FF8C42',
  volume_surge_breakout:  '#6BCB77',
  rsi_oversold:           '#FF6B6B',
  macd_crossover:         '#FFD93D',
  earnings_surprise:      '#4D96FF',
  bulk_deal_cluster:      '#C77DFF',
  promoter_buying:        '#FF85A1',
  insider_trade_buy:      '#00E5FF',
}

const PATTERN_LABELS = {
  bollinger_breakout:     'Bollinger Squeeze',
  volume_surge_breakout:  'Volume Breakout',
  rsi_oversold:           'RSI Oversold',
  macd_crossover:         'MACD Cross',
  earnings_surprise:      'Earnings Beat',
  bulk_deal_cluster:      'Bulk Deal Cluster',
  promoter_buying:        'Promoter Buy',
  insider_trade_buy:      'Insider Trade',
}

export function PatternOverlay({ chartRef, patterns, chartWidth, chartHeight }) {
  const svgRef = useRef(null)
  const [boxes, setBoxes] = useState([])
  const [hoveredBox, setHoveredBox] = useState(null)

  useEffect(() => {
    if (!chartRef?.current || !patterns?.length) return

    const timer = setTimeout(() => {
      computeBoxPositions()
    }, 300)

    return () => clearTimeout(timer)
  }, [chartRef, patterns, chartWidth, chartHeight])

  function computeBoxPositions() {
    const chart = chartRef.current
    if (!chart) return

    const timeScale = chart.timeScale()
    const series = chart._seriesArray?.[0]

    const computed = []

    for (const pattern of patterns) {
      try {
        const xStart = timeScale.timeToCoordinate(pattern.startDate)
        const xEnd   = timeScale.timeToCoordinate(pattern.endDate)

        let yTop, yBottom

        if (series && series.priceToCoordinate) {
          yTop    = series.priceToCoordinate(pattern.highPrice)
          yBottom = series.priceToCoordinate(pattern.lowPrice)
        } else {
          const chartPriceRange = 200
          yTop    = chartHeight * 0.2
          yBottom = chartHeight * 0.8
        }

        if (
          xStart !== null && xEnd !== null &&
          xStart !== undefined && xEnd !== undefined &&
          xStart < xEnd &&
          xStart >= 0 && xEnd <= chartWidth
        ) {
          computed.push({
            id: pattern.id || `${pattern.type}-${pattern.startDate}`,
            type: pattern.type,
            x: xStart,
            y: Math.min(yTop, yBottom),
            width: xEnd - xStart,
            height: Math.abs(yBottom - yTop),
            color: PATTERN_COLORS[pattern.type] || '#F5A623',
            label: PATTERN_LABELS[pattern.type] || pattern.type,
            winRate: pattern.winRate,
            startDate: pattern.startDate,
            endDate: pattern.endDate,
          })
        }
      } catch (err) {
        console.warn('PatternOverlay: could not position pattern', pattern.type, err.message)
      }
    }

    setBoxes(computed)
  }

  if (!boxes.length) return null

  return (
    <svg
      ref={svgRef}
      className="pattern-overlay-svg"
      width={chartWidth}
      height={chartHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <AnimatePresence>
        {boxes.map((box, index) => (
          <PatternBox
            key={box.id}
            box={box}
            index={index}
            isHovered={hoveredBox === box.id}
            onHover={(id) => setHoveredBox(id)}
          />
        ))}
      </AnimatePresence>
    </svg>
  )
}

function PatternBox({ box, index, isHovered, onHover }) {
  const { x, y, width, height, color, label, winRate, id } = box

  const safeWidth  = Math.max(width, 40)
  const safeHeight = Math.max(height, 30)

  return (
    <motion.g
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.12, duration: 0.35, ease: 'easeOut' }}
      style={{ transformOrigin: `${x}px ${y + safeHeight / 2}px`, pointerEvents: 'all', cursor: 'pointer' }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <rect
        x={x}
        y={y}
        width={safeWidth}
        height={safeHeight}
        fill={`${color}14`}
        stroke={color}
        strokeWidth={isHovered ? 2 : 1.5}
        strokeDasharray="5,3"
        rx={3}
        opacity={isHovered ? 1 : 0.75}
        style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
      />

      <rect
        x={x + 4}
        y={y - 11}
        width={label.length * 6.5 + 10}
        height={14}
        fill={color}
        rx={3}
        opacity={0.9}
      />
      <text
        x={x + 9}
        y={y - 1}
        fontSize={9}
        fontFamily="var(--font-mono)"
        fontWeight="700"
        fill="#0A0A0F"
        letterSpacing="0.04em"
      >
        {label}
      </text>

      {winRate && (
        <>
          <rect
            x={x + safeWidth - 32}
            y={y + 4}
            width={28}
            height={14}
            fill={`${color}25`}
            stroke={color}
            strokeWidth={0.8}
            rx={3}
          />
          <text
            x={x + safeWidth - 18}
            y={y + 14}
            fontSize={8.5}
            fontFamily="var(--font-mono)"
            fontWeight="800"
            fill={color}
            textAnchor="middle"
          >
            {winRate}%
          </text>
        </>
      )}

      {isHovered && (
        <foreignObject
          x={x}
          y={y + safeHeight + 6}
          width={200}
          height={70}
        >
          <div className="pattern-box-tooltip">
            <div className="pbt-type" style={{ color }}>
              {label}
            </div>
            <div className="pbt-dates">
              {box.startDate} → {box.endDate}
            </div>
            <div className="pbt-winrate">
              Win rate: <strong style={{ color }}>{winRate}%</strong>
            </div>
            <div className="pbt-hint">Click in sidebar to jump here</div>
          </div>
        </foreignObject>
      )}
    </motion.g>
  )
}
