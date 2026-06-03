import { useState } from 'react'
import { motion } from 'framer-motion'

const CITATIONS = [
  {
    id: 'nse_ohlcv',
    icon: '📊',
    label: 'NSE OHLCV',
    sub: '15-min delay',
    tooltip: 'Price and volume data sourced from NSE India via unofficial API. 15-minute delay applies per SEBI free-data regulations.',
    color: '#00E5FF',
  },
  {
    id: 'bse_bulk',
    icon: '🏦',
    label: 'BSE Bulk Deals',
    sub: 'EOD T+0',
    tooltip: 'Bulk and block deal data from BSE India. Updated end-of-day. Source: bseindia.com bulk deal disclosures.',
    color: '#F5A623',
  },
  {
    id: 'sebi',
    icon: '📋',
    label: 'SEBI Disclosures',
    sub: 'T+2 filing lag',
    tooltip: 'Insider trading disclosures and SAST filings from SEBI EDGAR system. Promoter shareholding changes, director transactions.',
    color: '#C77DFF',
  },
  {
    id: 'yahoo_earn',
    icon: '📈',
    label: 'Yahoo Finance',
    sub: 'Quarterly results',
    tooltip: 'Earnings data, EPS estimates vs actuals, analyst consensus sourced from Yahoo Finance public API.',
    color: '#6BCB77',
  },
  {
    id: 'finbert',
    icon: '🤖',
    label: 'FinBERT NLP',
    sub: 'Earnings sentiment',
    tooltip: 'Sentiment scoring of earnings call transcripts using ProsusAI/FinBERT model. Scores management commentary shift quarter-over-quarter.',
    color: '#FF85A1',
  },
]

export default function CitationBadges({ animate = true }) {
  return (
    <motion.div
      className="citation-badges-container"
      initial={animate ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <span className="citation-label">Sources:</span>
      <div className="citation-pills">
        {CITATIONS.map((citation, index) => (
          <CitationPill key={citation.id} citation={citation} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

function CitationPill({ citation, index }) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <motion.div
      className="citation-pill"
      style={{ '--pill-color': citation.color }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.06, duration: 0.25 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="citation-icon">{citation.icon}</span>
      <span className="citation-name">{citation.label}</span>
      <span className="citation-sub">{citation.sub}</span>

      {showTooltip && (
        <motion.div
          className="citation-tooltip"
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          <div className="tooltip-source-name">{citation.icon} {citation.label}</div>
          <div className="tooltip-text">{citation.tooltip}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
