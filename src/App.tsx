import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { CircularProgress, Stack } from '@mui/material'
import { AppLayout } from './components/Layout/AppLayout'
import { PrivateRoute } from './auth/PrivateRoute'

const Colaboradores = lazy(() => import('./pages/Colaboradores'))
const NovoColaborador = lazy(() => import('./pages/Colaboradores/NovoColaborador'))
const Departamentos = lazy(() => import('./pages/Departamentos'))
const Login = lazy(() => import('./pages/Auth/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Loader() {
  return (
    <Stack alignItems="center" mt={8}>
      <CircularProgress />
    </Stack>
  )
}

function PrivateShell() {
  return (
    <PrivateRoute>
      <AppLayout>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </AppLayout>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/colaboradores" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateShell />}>
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/colaboradores/novo" element={<NovoColaborador />} />
            <Route path="/departamentos" element={<Departamentos />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
