import { MenuItem, Stack, TextField } from '@mui/material'
import type { Colaborador, NivelHierarquico } from '../../types/Colaborador'
import type { Departamento } from '../../types/Departamento'

interface Props {
  data: Colaborador
  onChange: (data: Partial<Colaborador>) => void
  departamentos: Departamento[]
  gestores: { id: string; nome: string }[]
  errors?: Partial<Record<'departamentoId' | 'cargo' | 'dataAdmissao' | 'nivelHierarquico' | 'gestorId' | 'salarioBase', string>>
}

const niveis: { value: NivelHierarquico; label: string }[] = [
  { value: 'junior', label: 'Júnior' },
  { value: 'pleno', label: 'Pleno' },
  { value: 'senior', label: 'Sênior' },
  { value: 'gestor', label: 'Gestor' },
]

export function StepDadosProfissionais({ data, onChange, departamentos, gestores, errors }: Props) {
  const deptId = data.departamentoId

  return (
    <Stack spacing={2.5}>
      <TextField
        select
        label="Departamento"
        value={deptId}
        onChange={(e) => {
          const id = e.target.value
          const dept = departamentos.find((d) => d.id === id)
          onChange({ departamentoId: id, departamentoNome: dept?.nome || '' })
        }}
        fullWidth
        required
        error={!!errors?.departamentoId}
        helperText={errors?.departamentoId}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      >
        {departamentos.map((d) => (
          <MenuItem key={d.id} value={d.id}>
            {d.nome}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Cargo"
        value={data.profissional.cargo}
        onChange={(e) => onChange({ profissional: { ...data.profissional, cargo: e.target.value } })}
        fullWidth
        required
        error={!!errors?.cargo}
        helperText={errors?.cargo}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <TextField
        label="Data de admissão"
        type="date"
        value={data.profissional.dataAdmissao}
        onChange={(e) => onChange({ profissional: { ...data.profissional, dataAdmissao: e.target.value } })}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        error={!!errors?.dataAdmissao}
        helperText={errors?.dataAdmissao}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <TextField
        select
        label="Nível hierárquico"
        value={data.profissional.nivelHierarquico}
        onChange={(e) => onChange({ profissional: { ...data.profissional, nivelHierarquico: e.target.value as NivelHierarquico } })}
        fullWidth
        required
        error={!!errors?.nivelHierarquico}
        helperText={errors?.nivelHierarquico}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      >
        {niveis.map((n) => (
          <MenuItem key={n.value} value={n.value}>
            {n.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Gestor responsável"
        value={data.profissional.gestorId}
        onChange={(e) => onChange({ profissional: { ...data.profissional, gestorId: e.target.value } })}
        fullWidth
        required
        disabled={!gestores.length}
        error={!!errors?.gestorId}
        helperText={errors?.gestorId || (!gestores.length ? 'Cadastre pelo menos 1 colaborador com nível "Gestor".' : '')}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      >
        {gestores.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.nome}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Salário base (R$)"
        value={Number.isFinite(data.profissional.salarioBase) ? String(data.profissional.salarioBase) : ''}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.,]/g, '')
          const normalized = raw.replace('.', '').replace(',', '.')
          const n = Number(normalized)
          onChange({ profissional: { ...data.profissional, salarioBase: Number.isFinite(n) ? n : 0 } })
        }}
        fullWidth
        required
        error={!!errors?.salarioBase}
        helperText={errors?.salarioBase}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
    </Stack>
  )
}
