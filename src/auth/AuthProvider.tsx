import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { auth } from '../services/firebase'
import { AuthContext, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      try {
        if (u) {
          const token = await u.getIdToken()
          setIdToken(token)
        } else {
          setIdToken(null)
        }
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      idToken,
      loginWithEmail: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
      },
      logout: async () => {
        await signOut(auth)
      },
    }),
    [user, loading, idToken]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
