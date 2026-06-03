import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function InvestmentAwarenessModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show only once per session
    const hasSeen = sessionStorage.getItem('hasSeenAwarenessModal');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('hasSeenAwarenessModal', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(8px)', padding: 16
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="card-3d gradient-border"
            style={{
              position: 'relative', width: '100%', maxWidth: 500, background: 'var(--bg-card)', padding: '32px 24px',
              borderRadius: 24, border: '1px solid var(--border-card)', textAlign: 'center',
              boxShadow: '0 20px 80px rgba(0,0,0,0.4), 0 0 40px rgba(245,166,35,0.1)'
            }}
          >
            <button
              onClick={handleClose}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <AlertTriangle size={28} />
              </div>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
              Investment Awareness
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28, padding: '0 12px' }}>
              OpportunityRadar is an advanced analytical platform built for demonstration purposes.
              The signals and data displayed are for informational purposes only and 
              do <strong style={{ color: 'var(--accent-gold)' }}>not</strong> constitute financial advice. All investments 
              carry risk. Please consult a SEBI-registered advisor before trading.
            </p>
            <button
              onClick={handleClose}
              className="landing-btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}
            >
              I Understand & Proceed
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
