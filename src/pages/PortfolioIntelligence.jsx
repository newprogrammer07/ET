import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../App'
import { demoPortfolios, mockSignals, signalTypeMap } from '../data/mockSignals'
import { getPortfolioSignals } from '../api/signals'
import { streamPortfolioAnalysis } from '../api/claude'
import { TypewriterText, AnimatedNumber } from '../components/Shared'
import CitationBadges from '../components/CitationBadges'
import { Plus, Trash2, Send, Briefcase, Bell, BellOff, MessageSquare, Sparkles } from 'lucide-react'

const suggestedQuestions = [
  "What signals are relevant to my portfolio this week?",
  "Is now a good time to add to my HDFC Bank position?",
  "Which of my holdings has the most risk signals right now?",
  "Explain the MACD crossover on RELIANCE to me"
]

export default function PortfolioIntelligence() {
  const { portfolio, setPortfolio, watchlist, addToWatchlist, removeFromWatchlist } = useAppContext()
  const [newStock, setNewStock] = useState({ ticker: '', qty: '', price: '' })
  const [personalizedSignals, setPersonalizedSignals] = useState({ relevant: [], watchlist: [] })
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [alerts, setAlerts] = useState({})

  useEffect(() => {
    if (portfolio.length > 0) {
      getPortfolioSignals(portfolio).then(setPersonalizedSignals)
    }
  }, [portfolio])

  const loadDemoPortfolio = (demo) => {
    setPortfolio(demo.stocks)
  }

  const addStock = () => {
    if (newStock.ticker) {
      setPortfolio(prev => [...prev, { ticker: newStock.ticker.toUpperCase(), qty: parseInt(newStock.qty) || 0, avgPrice: parseFloat(newStock.price) || 0 }])
      setNewStock({ ticker: '', qty: '', price: '' })
    }
  }

  const removeStock = (ticker) => setPortfolio(prev => prev.filter(s => s.ticker !== ticker))

  const sendMessage = async () => {
    if (!chatInput.trim()) return
    const q = chatInput
    setChatHistory(prev => [...prev, { role: 'user', text: q }])
    setChatInput('')
    setIsTyping(true)
    
    // Add empty placeholder for AI response
    setChatHistory(prev => [...prev, { role: 'ai', text: '', citations: [] }])
    
    await streamPortfolioAnalysis(
      q,
      portfolio,
      personalizedSignals.relevant,
      (chunk) => {
        setIsTyping(false)
        setChatHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1].text = chunk
          return newHistory
        })
      },
      (finalText) => {
        setChatHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1].text = finalText
          newHistory[newHistory.length - 1].citations = [
            'NSE OHLCV (15-min limit)', 'BSE Bulk Deals (EOD)', 'Yahoo Finance Earn.'
          ]
          return newHistory
        })
      }
    )
  }

  return (
    <div style={{ display: 'flex', gap: 24, minHeight: 'calc(100vh - 200px)' }}>
      {/* Main Content */}
      <div style={{ flex: '0 0 72%', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Portfolio Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Briefcase size={20} color="var(--accent-gold)" /> Portfolio Input
              </h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {demoPortfolios.map(d => (
                  <button key={d.name} onClick={() => loadDemoPortfolio(d)}
                    style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border-card)', background: 'var(--bg-elevated)', color: 'var(--accent-teal)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, transition: 'all 0.2s' }}>
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Health Score Gauge */}
            {portfolio.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px 24px', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Portfolio Health</div>
                <div style={{ position: 'relative', width: 120, height: 60, margin: '0 auto' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: 120, height: 60, overflow: 'hidden' }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', border: '12px solid var(--bg-elevated)', borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', boxSizing: 'border-box' }} />
                    <motion.div initial={{ transform: 'rotate(-45deg)' }} animate={{ transform: 'rotate(105deg)' }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                      style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 120, borderRadius: '50%', border: '12px solid var(--accent-green)', borderBottomColor: 'transparent', borderLeftColor: 'transparent', boxSizing: 'border-box', transformOrigin: 'center center' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: 'var(--accent-green)' }}>
                    <AnimatedNumber value={84} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Portfolio Table */}
          {portfolio.length > 0 && (
            <div style={{ marginBottom: 16, overflowX: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Ticker</th><th>Qty</th><th>Avg Price</th><th>Current</th><th>P&L</th><th></th></tr></thead>
                <tbody>
                  {portfolio.map(s => {
                    const current = mockSignals.find(m => m.ticker === s.ticker)
                    const pnl = current ? ((current.currentPrice - s.avgPrice) / s.avgPrice * 100) : 0
                    return (
                      <motion.tr key={s.ticker} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <td style={{ fontWeight: 700 }}>{s.ticker}</td>
                        <td>{s.qty}</td>
                        <td>₹{s.avgPrice.toLocaleString()}</td>
                        <td>₹{current ? current.currentPrice.toLocaleString() : '—'}</td>
                        <td style={{ color: pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 700 }}>
                          {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%
                        </td>
                        <td><button onClick={() => removeStock(s.ticker)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}><Trash2 size={14} /></button></td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Stock */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={newStock.ticker} onChange={e => setNewStock({ ...newStock, ticker: e.target.value })} placeholder="Ticker" 
              style={{ flex: '0 0 120px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            <input value={newStock.qty} onChange={e => setNewStock({ ...newStock, qty: e.target.value })} placeholder="Qty" type="number"
              style={{ flex: '0 0 80px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            <input value={newStock.price} onChange={e => setNewStock({ ...newStock, price: e.target.value })} placeholder="Avg Price" type="number"
              style={{ flex: '0 0 120px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            <button onClick={addStock}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent-gold)', color: '#0A0A0F', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} /> Add
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginLeft: 8, opacity: 0.6 }}>Import from CAMS — Coming Soon</span>
          </div>
        </motion.div>

        {/* Personalized Signals */}
        {portfolio.length > 0 && personalizedSignals.relevant.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="var(--accent-gold)" /> Signals for Your Portfolio
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {personalizedSignals.relevant.map(s => {
                const type = signalTypeMap[s.signalType]
                return (
                  <div key={s.id} className="card-3d" style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span className="badge badge-new" style={{ fontSize: 9 }}>YOUR PORTFOLIO</span>
                    <span className={`badge ${type.badge}`}>{type.icon} {type.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{s.ticker}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', marginLeft: 'auto' }}>₹{s.currentPrice.toLocaleString()}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-gold)', fontWeight: 700 }}>Score: {s.signalScore}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-teal)' }}>WR: {s.winRate}%</span>
                  </div>
                )
              })}
            </div>
            {personalizedSignals.watchlist.length > 0 && (
              <>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, margin: '20px 0 12px', color: 'var(--text-secondary)' }}>Stocks you DON'T own but should watch</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {personalizedSignals.watchlist.map(s => {
                    const type = signalTypeMap[s.signalType]
                    return (
                      <div key={s.id} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border-subtle)' }}>
                        <span className={`badge ${type.badge}`} style={{ fontSize: 9 }}>{type.icon} {type.label}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>{s.companyName}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginLeft: 'auto', color: 'var(--accent-gold)' }}>Score: {s.signalScore}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* AI Chat */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass" style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={18} color="var(--accent-teal)" /> AI Portfolio Advisor
          </h3>

          {/* Suggested Questions */}
          {chatHistory.length === 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => { setChatInput(q); setTimeout(() => { setChatInput(q); sendMessage() }, 50) }}
                  style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid var(--border-card)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-gold)'; e.target.style.color = 'var(--accent-gold)' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.color = 'var(--text-secondary)' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, paddingRight: 8 }}>
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}
                style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
                {msg.role === 'ai' && (
                  <CitationBadges animate={i === chatHistory.length - 1} />
                )}
              </motion.div>
            ))}
            {isTyping && (
              <div className="chat-message-ai" style={{ alignSelf: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your portfolio..."
              style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }} />
            <button onClick={sendMessage}
              style={{ padding: '12px 20px', borderRadius: 12, border: 'none', background: 'var(--accent-gold)', color: '#0A0A0F', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={16} />
            </button>
          </div>

          {/* SEBI Disclaimer */}
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)', borderRadius: 8, fontSize: 10, color: 'var(--accent-amber)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
            ⚠️ This is an analytical signal, not investment advice. Past performance does not guarantee future results. Consult a SEBI-registered advisor before making investment decisions.
          </div>
        </motion.div>
      </div>

      {/* Watchlist Sidebar */}
      <div style={{ flex: '0 0 26%' }}>
        <div className="glass" style={{ borderRadius: 16, padding: 20, position: 'sticky', top: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Watchlist
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{watchlist.length}/20</span>
          </h3>
          {watchlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', fontSize: 13 }}>
              Add stocks from signal cards<br />to build your watchlist
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {watchlist.map(ticker => {
                const signal = mockSignals.find(s => s.ticker === ticker)
                const activeSignals = mockSignals.filter(s => s.ticker === ticker).length
                return (
                  <motion.div key={ticker} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>{ticker}</div>
                      {signal && (
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: signal.priceChange >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                          ₹{signal.currentPrice} ({signal.priceChange >= 0 ? '+' : ''}{signal.priceChange}%)
                        </div>
                      )}
                    </div>
                    {activeSignals > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'rgba(245,166,35,0.15)', color: 'var(--accent-gold)', borderRadius: 6, padding: '2px 6px' }}>
                        {activeSignals} signal{activeSignals > 1 ? 's' : ''}
                      </span>
                    )}
                    <button onClick={() => setAlerts(a => ({ ...a, [ticker]: !a[ticker] }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: alerts[ticker] ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                      {alerts[ticker] ? <Bell size={14} /> : <BellOff size={14} />}
                    </button>
                    <button onClick={() => removeFromWatchlist(ticker)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
