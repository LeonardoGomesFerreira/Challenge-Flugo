import { Typography, Stack, Box, Chip } from '@mui/material'
import type { Colaborador } from '../../types/Colaborador'

interface Props {
  data: Colaborador
}

export function StepRevisao({ data }: Props) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={600} mb={0.5}>
          Nome
        </Typography>
        <Typography fontSize="1rem" fontWeight={500} color="#111827">
          {data.nome || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={600} mb={0.5}>
          Email
        </Typography>
        <Typography fontSize="1rem" fontWeight={500} color="#111827">
          {data.email || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={600} mb={0.5}>
          Departamento
        </Typography>
        <Typography fontSize="1rem" fontWeight={500} color="#111827">
          {data.departamento || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={600} mb={1}>
          Status
        </Typography>
        <Chip
          size="small"
          label={data.ativo ? 'Ativo' : 'Inativo'}
          sx={{
            bgcolor: data.ativo ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: data.ativo ? '#22C55E' : '#EF4444',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            px: 1.5,
          }}
        />
      </Box>
    </Stack>
  )
}