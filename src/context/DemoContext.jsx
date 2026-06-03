import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../App'

const DemoContext = createContext()

export const useDemo = () => useContext(DemoContext)

export function DemoProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [scanActive, setScanActive] = useState(true) // Initial load triggers scan
  const location = useLocation()
  const navigate = useNavigate()
  const { setSelectedSignal, setWatchlist, setPortfolio } = useAppContext()

  const isJudgeMode = new URLSearchParams(location.search).get('mode') === 'judge-demo'

  const triggerScan = useCallback(() => {
    setScanActive(true)
    setTimeout(() => setScanActive(false), 2600)
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  // Demo Reset functionality
  const resetDemoState = useCallback(() => {
    setSelectedSignal(null)
    setWatchlist([])
    // We can load demo portfolio 1:
    setPortfolio([
      { ticker: 'HDFCBANK', quantity: 150, purchasePrice: 1520, currentPrice: 1680.45 },
      { ticker: 'RELIANCE', quantity: 50, purchasePrice: 2840, currentPrice: 2954.20 },
      { ticker: 'TCS', quantity: 25, purchasePrice: 3850, currentPrice: 4120.80 }
    ])
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Dispatch event so components like ScanAnimation can restart
    window.dispatchEvent(new Event('demo-reset'))
    triggerScan()
    
    showToast("✅ Demo reset complete — ready for judges", "success")
  }, [setSelectedSignal, setWatchlist, setPortfolio, showToast, triggerScan])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        resetDemoState()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [resetDemoState])

  // Global toast listener
  useEffect(() => {
    const handleGlobalToast = (e) => {
      if (e.detail && e.detail.message) {
        showToast(e.detail.message, e.detail.type || 'info')
      }
    }
    window.addEventListener('show-toast', handleGlobalToast)
    return () => window.removeEventListener('show-toast', handleGlobalToast)
  }, [showToast])

  // Mock Toast interval in Judge Mode
  useEffect(() => {
    if (!isJudgeMode) return
    
    const interval = setInterval(() => {
      showToast("🎯 NEW SIGNAL: TATA MOTORS — Volume Surge (Score: 89)", "info")
    }, 45000)
    
    return () => clearInterval(interval)
  }, [isJudgeMode, showToast])

  // Hide initial scan if moving away from home
  useEffect(() => {
    if (location.pathname !== '/dashboard') {
      setScanActive(false)
    }
  }, [location.pathname])

  return (
    <DemoContext.Provider value={{ isJudgeMode, showToast, resetDemoState, toasts, scanActive, setScanActive, triggerScan }}>
      {children}
    </DemoContext.Provider>
  )
}
