import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { CircularProgress, Stack } from '@mui/material'
import { AppLayout } from './components/Layout/AppLayout'

const Colaboradores = lazy(() => import('./pages/Colaboradores'))
const NovoColaborador = lazy(() => import('./pages/Colaboradores/NovoColaborador'))

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense
          fallback={
            <Stack alignItems="center" mt={8}>
              <CircularProgress />
            </Stack>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/colaboradores" replace />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/colaboradores/novo" element={<NovoColaborador />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  )
}