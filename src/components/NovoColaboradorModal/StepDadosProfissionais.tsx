import { MenuItem, TextField } from '@mui/material'
import type { Colaborador } from '../../types/Colaborador'

interface Props {
  data: Colaborador
  onChange: (data: Partial<Colaborador>) => void
  error?: string
}

export function StepDadosProfissionais({ data, onChange, error }: Props) {
  return (
    <TextField
      select
      label="Selecione um departamento"
      value={data.departamento}
      onChange={(e) => onChange({ departamento: e.target.value })}
      fullWidth
      required
      error={!!error}
      helperText={error}
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
    >
      <MenuItem value="Design">Design</MenuItem>
      <MenuItem value="TI">TI</MenuItem>
      <MenuItem value="Marketing">Marketing</MenuItem>
      <MenuItem value="Produto">Produto</MenuItem>
    </TextField>
  )
}