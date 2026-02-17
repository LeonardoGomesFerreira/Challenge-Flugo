import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

type Props = {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}