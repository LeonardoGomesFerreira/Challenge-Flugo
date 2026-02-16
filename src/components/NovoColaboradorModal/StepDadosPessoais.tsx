import { Stack, TextField } from '@mui/material'
import type { Colaborador } from '../../types/Colaborador'

interface Props {
  data: Colaborador
  onChange: (data: Partial<Colaborador>) => void
  errors?: { nome?: string; email?: string } 
}

export function StepDadosPessoais({ data, onChange, errors }: Props) {
  return (
    <Stack spacing={3.5}>
      <TextField
        label="Nome"
        placeholder="Nome Completo"
        value={data.nome}
        onChange={(e) => onChange({ nome: e.target.value })}
        fullWidth
        required
        error={!!errors?.nome}
        helperText={errors?.nome}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#22C55E',
            },
          },
        }}
      />

      <TextField
        label="E-mail"
        placeholder="e.g. test@gmail.com"
        value={data.email}
        onChange={(e) => onChange({ email: e.target.value })}
        fullWidth
        required
        error={!!errors?.email}
        helperText={errors?.email}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#22C55E',
            },
          },
        }}
      />
    </Stack>
  )
}