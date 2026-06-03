import React from 'react'
import { useDemo } from '../context/DemoContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ToastContainer() {
  const { toasts } = useDemo()

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`glass p-4 rounded-xl shadow-2xl flex items-center gap-3 border-l-4
              ${toast.type === 'success' ? 'border-green-400' : 
                toast.type === 'warning' ? 'border-yellow-400' : 'border-blue-400'}`}
            style={{ 
              background: 'var(--bg-card)', 
              color: 'var(--text-primary)',
              minWidth: 320,
              pointerEvents: 'auto',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div className="font-medium">{toast.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
