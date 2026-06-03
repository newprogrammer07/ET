import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Rss } from 'lucide-react'

const mockNewsData = [
  { title: "Nifty 50 touches new all-time high amid strong FII inflows", link: "#", pubDate: new Date().toISOString() },
  { title: "Reliance Industries announces a new green energy initiative in Gujarat", link: "#", pubDate: new Date(Date.now() - 3600000).toISOString() },
  { title: "RBI Governor hints at potential rate cuts in upcoming Q3 review", link: "#", pubDate: new Date(Date.now() - 7200000).toISOString() },
  { title: "Tata Motors domestic sales break records with robust EV adoption", link: "#", pubDate: new Date(Date.now() - 10800000).toISOString() },
  { title: "IT sector earnings top estimates, strong guidance sets positive tone", link: "#", pubDate: new Date(Date.now() - 14400000).toISOString() }
]

export function LiveNewsFeed() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news', { signal: AbortSignal.timeout(10000) })
        if (!res.ok) throw new Error('Failed to fetch news')
        const data = await res.json()
        if (data.status === 'success' && data.news.length > 0) {
          setNews(data.news)
          setIsMock(false)
        } else {
          throw new Error(data.message || 'Error parsing news')
        }
      } catch (err) {
        setNews(mockNewsData)
        setIsMock(true)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
    const interval = setInterval(fetchNews, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass" style={{ borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          <Rss size={16} color="var(--accent-gold)" /> Market News
        </h3>
        {isMock && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent-red)', background: 'rgba(255,82,82,0.1)', padding: '2px 6px', borderRadius: 4 }}>
            MOCK DATA
          </span>
        )}
      </div>
      
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 64 }} />)
        ) : news.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
            No recent news headlines available.
          </div>
        ) : (
          news.map((item, i) => (
            <motion.a 
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'block',
                textDecoration: 'none',
                padding: '12px 14px',
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-active)'
                e.currentTarget.style.background = 'var(--bg-card-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.background = 'var(--bg-secondary)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
                  {item.title}
                </div>
                <ExternalLink size={14} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
              {item.pubDate && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
                  {new Date(item.pubDate).toLocaleString()}
                </div>
              )}
            </motion.a>
          ))
        )}
      </div>
    </div>
  )
}
