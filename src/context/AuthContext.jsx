import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const AuthContext = createContext()

const API_URL = 'http://localhost:8000/api/auth'

// Sync Firebase user to backend SQLite database
const syncUserToBackend = async (firebaseUser, provider = 'email') => {
  try {
    const response = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || null,
        auth_provider: provider,
      }),
    })
    if (!response.ok) {
      console.error('Backend sync failed:', await response.text())
    }
  } catch (err) {
    console.error('Backend sync error:', err)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    await syncUserToBackend(result.user, 'google')
    return result.user
  }

  const signInWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await syncUserToBackend(result.user, 'email')
    return result.user
  }

  const signUpWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await syncUserToBackend(result.user, 'email')
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)