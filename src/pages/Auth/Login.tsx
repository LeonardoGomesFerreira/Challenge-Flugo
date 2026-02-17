import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { useAuth } from '../../auth/useAuth'
import { getLoginStats } from '../../services/stats.service'

export default function Login() {
  const { loginWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [stats, setStats] = useState<{ ativos: number; departamentos: number } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const redirectTo = (() => {
    const state = location.state as { from?: string } | null
    return state?.from || '/colaboradores'
  })()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ✅ Carrega stats reais do Firestore (ativos + departamentos)
  useEffect(() => {
    let mounted = true
    setStatsLoading(true)

    getLoginStats()
      .then((r) => {
        if (!mounted) return
        setStats(r)
      })
      .catch(() => {
        // se suas regras exigirem auth, pode dar permission-denied aqui.
        // Não quebramos o login por causa disso.
        if (!mounted) return
        setStats(null)
      })
      .finally(() => {
        if (!mounted) return
        setStatsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const canSubmit = useMemo(() => {
    const e = email.trim()
    return /^\S+@\S+\.\S+$/.test(e) && password.length >= 6
  }, [email, password])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginWithEmail(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err: unknown) {
      const maybeErr = err as { code?: unknown }
      const code = String(maybeErr?.code || '')

      if (code.includes('invalid-credential') || code.includes('wrong-password')) {
        setError('E-mail ou senha inválidos.')
      } else if (code.includes('user-not-found')) {
        setError('Usuário não encontrado.')
      } else if (code.includes('too-many-requests')) {
        setError('Muitas tentativas. Tente novamente mais tarde.')
      } else {
        setError('Não foi possível entrar. Verifique suas credenciais.')
      }
    } finally {
      setLoading(false)
    }
  }

  const statsCards = useMemo(() => {
    const ativosValue = statsLoading ? '—' : String(stats?.ativos ?? 0)
    const depsValue = statsLoading ? '—' : String(stats?.departamentos ?? 0)

    return [
      { label: 'Colaboradores ativos', value: ativosValue },
      { label: 'Departamentos', value: depsValue },
    ]
  }, [stats, statsLoading])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#F0F2F5',
      }}
    >
      {/* Painel esquerdo — decorativo */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F2916 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorativo */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(34,197,94,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(22,163,74,0.08) 0%, transparent 50%)
            `,
          }}
        />

        {/* Grid pattern decorativo */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: 'relative' }}>
          <Box
            component="img"
            src="/flugo-logo.svg"
            alt="Flugo"
            sx={{ height: 36, width: 'auto', display: 'block' }}
          />
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>
            Flugo
          </Typography>
        </Stack>

        {/* Texto central */}
        <Box sx={{ position: 'relative' }}>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 800,
              fontSize: '2.5rem',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              mb: 2,
            }}
          >
            Gerencie sua equipe com{' '}
            <Box component="span" sx={{ color: '#22C55E' }}>
              eficiência
            </Box>
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6 }}>
            Controle colaboradores, departamentos e hierarquias em um só lugar.
          </Typography>
        </Box>

        {/* Cards de estatística — agora vindos do Firestore */}
        <Stack spacing={2} sx={{ position: 'relative' }}>
          {statsCards.map(({ label, value }) => (
            <Stack
              key={label}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>{label}</Typography>
              <Typography sx={{ color: '#22C55E', fontWeight: 700, fontSize: '0.875rem' }}>{value}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Painel direito — formulário */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Header mobile */}
          <Stack direction="row" alignItems="center" spacing={1.5} mb={5} sx={{ display: { md: 'none' } }}>
            <Box
              component="img"
              src="/flugo-logo.svg"
              alt="Flugo"
              sx={{ height: 32, width: 'auto', display: 'block' }}
            />
            <Typography sx={{ fontWeight: 900, fontSize: '1.35rem', color: '#0F172A', letterSpacing: '-0.03em' }}>
              Flugo
            </Typography>
          </Stack>

          <Box mb={4}>
            <Typography variant="h4" fontWeight={800} color="#0F172A" mb={0.75}>
              Bem-vindo de volta 👋
            </Typography>
            <Typography color="text.secondary">
              Entre com suas credenciais para acessar o painel.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    border: '1px solid rgba(239,68,68,0.2)',
                    bgcolor: 'rgba(239,68,68,0.05)',
                    '& .MuiAlert-icon': { color: '#EF4444' },
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                fullWidth
                type={showPwd ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPwd((s) => !s)}
                        edge="end"
                        aria-label="mostrar senha"
                        size="small"
                        sx={{ color: '#94A3B8' }}
                      >
                        {showPwd ? (
                          <VisibilityOffRoundedIcon fontSize="small" />
                        ) : (
                          <VisibilityRoundedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit || loading}
                endIcon={!loading && <ArrowForwardRoundedIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  mt: 0.5,
                }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Stack>
          </Box>

          <Typography color="#94A3B8" fontSize="0.8rem" mt={3} textAlign="center">
            Crie usuários no Firebase Authentication (Email/Senha) para acessar.
          </Typography>

          {!statsLoading && stats === null && (
            <Typography color="#94A3B8" fontSize="0.75rem" mt={1.25} textAlign="center">
              * As estatísticas podem não aparecer antes do login dependendo das regras do Firestore.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}