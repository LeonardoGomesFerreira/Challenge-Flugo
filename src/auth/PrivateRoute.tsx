import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Stack } from '@mui/material'
import { useAuth } from './useAuth'

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Stack alignItems="center" mt={10}>
        <CircularProgress />
      </Stack>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Box sx={{ minHeight: '100vh' }}>{children}</Box>
}
