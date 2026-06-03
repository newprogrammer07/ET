import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, User, Sun, Moon } from 'lucide-react'

export default function SignUp() {
  const { theme, toggleTheme } = useTheme()
  const { signInWithGoogle, signUpWithEmail } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (!agreed) { setError('Please agree to the terms.'); return }
    setLoading(true)
    setError('')
    try {
      await signUpWithEmail(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const code = err.code
      if (code === 'auth/email-already-in-use') setError('An account with this email already exists. Try signing in instead.')
      else if (code === 'auth/weak-password') setError('Password should be at least 6 characters.')
      else if (code === 'auth/invalid-email') setError('Please enter a valid email address.')
      else setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container bg-grid" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <div className="theme-toggle-knob" />
          <Moon size={12} style={{ position: 'absolute', left: 6, top: 8, color: theme === 'dark' ? '#0A0A0F' : 'var(--text-muted)', transition: 'color 0.3s' }} />
          <Sun size={12} style={{ position: 'absolute', right: 6, top: 8, color: theme === 'light' ? '#fff' : 'var(--text-muted)', transition: 'color 0.3s' }} />
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }} className="auth-card">

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 36, height: 36 }}>
                <svg viewBox="0 0 40 40" style={{ width: 36, height: 36 }}>
                  <circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" opacity="0.3" />
                  <circle cx="20" cy="20" r="12" fill="none" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.5" />
                  <circle cx="20" cy="20" r="2" fill="var(--accent-gold)" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent-gold)' }}>Opportunity</span>Radar
              </span>
            </div>
          </Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Create your free account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
              fontFamily: 'var(--font-body)', fontSize: 13, color: '#ef4444', lineHeight: 1.5
            }}>
            {error}
          </motion.div>
        )}

        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-card)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-card)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="auth-input" style={{ paddingLeft: 40 }} placeholder="Your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" className="auth-input" style={{ paddingLeft: 40 }} placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPw ? 'text' : 'password'} className="auth-input" style={{ paddingLeft: 40, paddingRight: 44 }}
                placeholder="Create a password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPw ? 'text' : 'password'} className="auth-input" style={{ paddingLeft: 40 }}
                placeholder="Confirm password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: 3, accentColor: 'var(--accent-gold)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              I agree to the <Link to="#" className="auth-link" style={{ fontSize: 12 }}>Terms of Service</Link> and <Link to="#" className="auth-link" style={{ fontSize: 12 }}>Privacy Policy</Link>
            </span>
          </label>
          <button type="submit" className="landing-btn-primary" disabled={loading || !agreed}
            style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '14px 0', opacity: agreed ? 1 : 0.5 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}