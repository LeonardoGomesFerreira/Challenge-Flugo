import { Box, Button, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F0F2F5',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fundo decorativo */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 30% 50%, rgba(34,197,94,0.06) 0%, transparent 60%),
            radial-gradient(circle at 70% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Grid pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <Stack alignItems="center" spacing={3} sx={{ position: 'relative', textAlign: 'center', maxWidth: 480 }}>
        {/* Número grande */}
        <Box sx={{ position: 'relative' }}>
          <Typography
            sx={{
              fontSize: { xs: '8rem', md: '12rem' },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: '2px #E2E8F0',
              userSelect: 'none',
            }}
          >
            404
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: { xs: '8rem', md: '12rem' },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#0F172A',
              opacity: 0.08,
            }}
          >
            404
          </Typography>
        </Box>

        {/* Badge */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            borderRadius: 5,
            bgcolor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#EF4444' }} />
          <Typography fontSize="0.8rem" fontWeight={700} color="#EF4444">
            Página não encontrada
          </Typography>
        </Box>

        <Stack spacing={1} alignItems="center">
          <Typography variant="h5" fontWeight={800} color="#0F172A">
            Ops! Esse endereço não existe
          </Typography>
          <Typography color="#64748B" lineHeight={1.7}>
            O endereço que você tentou acessar não existe ou foi movido para outro local.
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/colaboradores')}
          sx={{ px: 4, py: 1.5, fontWeight: 800, fontSize: '0.9rem' }}
        >
          Voltar para o início
        </Button>
      </Stack>
    </Box>
  )
}