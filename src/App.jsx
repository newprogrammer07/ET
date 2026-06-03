import { useState, createContext, useContext } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import Header from './components/Header'
import OpportunityRadar from './pages/OpportunityRadar'
import ChartPatterns from './pages/ChartPatterns'
import HistoricalProof from './pages/HistoricalProof'
import PortfolioIntelligence from './pages/PortfolioIntelligence'
import SignalPerformance from './pages/SignalPerformance'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { MarketVideo } from './pages/MarketVideo'
import SEBIDisclaimer from './components/SEBIDisclaimer'
import ProtectedRoute from './components/ProtectedRoute'
import { DemoProvider } from './context/DemoContext'
import ToastContainer from './components/Toast'
import InvestmentAwarenessModal from './components/InvestmentAwarenessModal'

export const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

const tabs = [
  { id: '/dashboard', label: 'Opportunity Radar', icon: '🎯' },
  { id: '/dashboard/chart-patterns', label: 'Chart Patterns', icon: '📈' },
  { id: '/dashboard/historical-proof', label: 'Historical Proof', icon: '🔬' },
  { id: '/dashboard/portfolio', label: 'Portfolio Intelligence', icon: '💼' },
  { id: '/dashboard/signal-performance', label: 'Signal Performance', icon: '📊' },
  { id: '/dashboard/market-video', label: 'Market Video', icon: '🎬' }
]

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-grid" style={{ background: 'var(--bg-primary)' }}>
      <Header />

      {/* Navigation Tabs */}
      <nav className="glass" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0 24px' }}>
        <div className="hide-scrollbar" style={{ maxWidth: 1440, margin: '0 0', display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${location.pathname === tab.id ? 'active' : ''}`}
              onClick={() => navigate(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: 1440, margin: '0 auto', width: '100%', padding: '24px' }}>
        <Routes>
          <Route path="/" element={<OpportunityRadar />} />
          <Route path="/chart-patterns" element={<ChartPatterns />} />
          <Route path="/historical-proof" element={<HistoricalProof />} />
          <Route path="/portfolio" element={<PortfolioIntelligence />} />
          <Route path="/signal-performance" element={<SignalPerformance />} />
          <Route path="/market-video" element={<MarketVideo />} />
        </Routes>
      </main>

      <SEBIDisclaimer />
    </div>
  )
}

export default function App() {
  const [selectedSignal, setSelectedSignal] = useState(null)
  const [watchlist, setWatchlist] = useState([])
  const [portfolio, setPortfolio] = useState([])

  const addToWatchlist = (ticker) => {
    if (watchlist.length < 20 && !watchlist.includes(ticker)) {
      setWatchlist(prev => [...prev, ticker])
    }
  }

  const removeFromWatchlist = (ticker) => {
    setWatchlist(prev => prev.filter(t => t !== ticker))
  }

  return (
    <AppContext.Provider value={{ selectedSignal, setSelectedSignal, watchlist, addToWatchlist, removeFromWatchlist, portfolio, setPortfolio }}>
      <DemoProvider>
        <ToastContainer />
        <InvestmentAwarenessModal />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </DemoProvider>
    </AppContext.Provider>
  )
}