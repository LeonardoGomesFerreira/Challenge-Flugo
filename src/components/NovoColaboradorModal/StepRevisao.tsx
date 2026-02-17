import { Typography, Stack, Box, Chip, Divider } from '@mui/material'
import type { Colaborador } from '../../types/Colaborador'

interface Props {
  data: Colaborador
  gestorNome?: string
}

export function StepRevisao({ data, gestorNome }: Props) {
  const salario = data.profissional?.salarioBase ?? 0

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Nome
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {data.nome || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Email
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {data.email || '-'}
        </Typography>
      </Box>

      <Divider />

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Departamento
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {data.departamentoNome || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Cargo
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {data.profissional.cargo || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Data de admissão
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {data.profissional.dataAdmissao || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Nível hierárquico
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {data.profissional.nivelHierarquico || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Gestor responsável
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {gestorNome || '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={0.5}>
          Salário base
        </Typography>
        <Typography fontSize="1rem" fontWeight={600} color="#111827">
          {salario ? salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
        </Typography>
      </Box>

      <Box>
        <Typography fontSize="0.875rem" color="#6B7280" fontWeight={700} mb={1}>
          Status
        </Typography>
        <Chip
          size="small"
          label={data.ativo ? 'Ativo' : 'Inativo'}
          sx={{
            bgcolor: data.ativo ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: data.ativo ? '#22C55E' : '#EF4444',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.75rem',
            px: 1.5,
          }}
        />
      </Box>
    </Stack>
  )
}
