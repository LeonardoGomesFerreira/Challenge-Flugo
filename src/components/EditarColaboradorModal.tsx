import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import WorkRoundedIcon from '@mui/icons-material/WorkRounded'
import type { Colaborador, NivelHierarquico } from '../types/Colaborador'
import type { Departamento } from '../types/Departamento'

interface Props {
  open: boolean
  colaborador: Colaborador | null
  departamentos: Departamento[]
  gestores: { id: string; nome: string }[]
  onClose: () => void
  onSave: (colaborador: Colaborador) => Promise<void>
}

const niveis: { value: NivelHierarquico; label: string; color: string }[] = [
  { value: 'junior', label: 'Júnior', color: '#64748B' },
  { value: 'pleno', label: 'Pleno', color: '#3B82F6' },
  { value: 'senior', label: 'Sênior', color: '#8B5CF6' },
  { value: 'gestor', label: 'Gestor', color: '#22C55E' },
]

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1.5,
          bgcolor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
        }}
      >
        {icon}
      </Box>
      <Typography fontWeight={700} fontSize="0.85rem" color="#475569" textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Typography>
    </Stack>
  )
}

export function EditarColaboradorModal({ open, colaborador, departamentos, gestores, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Colaborador | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (colaborador) {
      setDraft({ ...colaborador })
      setError('')
    }
  }, [colaborador])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (!draft) return e
    if (!draft.departamentoId) e.departamentoId = 'Departamento é obrigatório'
    if (!draft.profissional.cargo.trim()) e.cargo = 'Cargo é obrigatório'
    if (!draft.profissional.dataAdmissao) e.dataAdmissao = 'Data de admissão é obrigatória'
    if (!draft.profissional.nivelHierarquico) e.nivelHierarquico = 'Nível é obrigatório'
    if (draft.profissional.nivelHierarquico !== 'gestor' && !draft.profissional.gestorId) {
      e.gestorId = 'Gestor responsável é obrigatório'
    }
    if (!Number.isFinite(draft.profissional.salarioBase) || draft.profissional.salarioBase <= 0) {
      e.salarioBase = 'Informe um salário base válido'
    }
    return e
  }, [draft])

  const canSave = draft && Object.keys(errors).length === 0

  const handleSave = async () => {
    if (!draft || !colaborador) return
    if (!canSave) { setError('Revise os campos obrigatórios.'); return }
    setError('')
    setSaving(true)
    try {
      await onSave(draft)
      onClose()
    } catch (err) {
      setError('Erro ao salvar alterações. Tente novamente.')
      console.error('Erro ao editar colaborador:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) { setError(''); onClose() }
  }

  if (!draft) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.2rem', pt: 3, px: 3.5, pb: 1 }}>
        Editar Colaborador
      </DialogTitle>

      <DialogContent sx={{ px: 3.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>
        )}

        <Stack spacing={3} mt={1.5}>

          {/* Dados pessoais (readonly) */}
          <Box>
            <SectionLabel icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />} label="Dados Pessoais" />
            <Stack spacing={2} mt={1.5}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: 2,
                }}
              >
                <Box flex={1}>
                  <Typography fontSize="0.75rem" color="#94A3B8" fontWeight={600} mb={0.25} textTransform="uppercase" letterSpacing="0.05em">
                    Nome
                  </Typography>
                  <Typography fontWeight={600} color="#0F172A">{draft.nome}</Typography>
                </Box>
                <Box flex={1}>
                  <Typography fontSize="0.75rem" color="#94A3B8" fontWeight={600} mb={0.25} textTransform="uppercase" letterSpacing="0.05em">
                    E-mail
                  </Typography>
                  <Typography fontWeight={500} color="#475569" fontSize="0.9rem">{draft.email}</Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: '#F1F5F9' }} />

          {/* Informações profissionais */}
          <Box>
            <SectionLabel icon={<WorkRoundedIcon sx={{ fontSize: 16 }} />} label="Informações Profissionais" />
            <Stack spacing={2} mt={1.5}>
              <TextField
                select
                label="Departamento"
                value={draft.departamentoId}
                onChange={(e) => {
                  const id = e.target.value
                  const dept = departamentos.find((d) => d.id === id)
                  setDraft((p) => p ? { ...p, departamentoId: id, departamentoNome: dept?.nome || '' } : p)
                }}
                fullWidth
                required
                error={!!errors.departamentoId}
                helperText={errors.departamentoId}
              >
                {departamentos.map((d) => (
                  <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Cargo"
                value={draft.profissional.cargo}
                onChange={(e) => setDraft((p) => p ? { ...p, profissional: { ...p.profissional, cargo: e.target.value } } : p)}
                fullWidth
                required
                error={!!errors.cargo}
                helperText={errors.cargo}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Data de admissão"
                  type="date"
                  value={draft.profissional.dataAdmissao}
                  onChange={(e) => setDraft((p) => p ? { ...p, profissional: { ...p.profissional, dataAdmissao: e.target.value } } : p)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dataAdmissao}
                  helperText={errors.dataAdmissao}
                />

                <TextField
                  label="Salário base (R$)"
                  value={Number.isFinite(draft.profissional.salarioBase) ? String(draft.profissional.salarioBase) : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9.,]/g, '')
                    const normalized = raw.replace('.', '').replace(',', '.')
                    const n = Number(normalized)
                    setDraft((p) => p ? { ...p, profissional: { ...p.profissional, salarioBase: Number.isFinite(n) ? n : 0 } } : p)
                  }}
                  fullWidth
                  required
                  error={!!errors.salarioBase}
                  helperText={errors.salarioBase}
                />
              </Stack>

              <TextField
                select
                label="Nível hierárquico"
                value={draft.profissional.nivelHierarquico}
                onChange={(e) =>
                  setDraft((p) => p ? { ...p, profissional: { ...p.profissional, nivelHierarquico: e.target.value as NivelHierarquico } } : p)
                }
                fullWidth
                required
                error={!!errors.nivelHierarquico}
                helperText={errors.nivelHierarquico}
              >
                {niveis.map((n) => (
                  <MenuItem key={n.value} value={n.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: n.color,
                        }}
                      />
                      <span>{n.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Gestor responsável"
                value={draft.profissional.gestorId}
                onChange={(e) => setDraft((p) => p ? { ...p, profissional: { ...p.profissional, gestorId: e.target.value } } : p)}
                fullWidth
                required={draft.profissional.nivelHierarquico !== 'gestor'}
                disabled={!gestores.length}
                error={!!errors.gestorId}
                helperText={
                  errors.gestorId ||
                  (!gestores.length
                    ? 'Cadastre pelo menos 1 colaborador com nível "Gestor".'
                    : draft.profissional.nivelHierarquico === 'gestor'
                      ? 'Opcional para nível Gestor'
                      : '')
                }
              >
                <MenuItem value="">(Sem gestor)</MenuItem>
                {gestores.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: '#F1F5F9' }} />

          {/* Status */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography fontWeight={700} color="#0F172A" fontSize="0.9rem">
                Status do colaborador
              </Typography>
              <Typography color="#94A3B8" fontSize="0.8rem">
                {draft.ativo ? 'Colaborador ativo na empresa' : 'Colaborador inativo'}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                size="small"
                label={draft.ativo ? 'Ativo' : 'Inativo'}
                sx={{
                  bgcolor: draft.ativo ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
                  color: draft.ativo ? '#16A34A' : '#DC2626',
                  fontWeight: 700,
                  border: `1px solid ${draft.ativo ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`,
                }}
              />
              <Switch
                checked={draft.ativo}
                onChange={(e) => setDraft((p) => p ? { ...p, ativo: e.target.checked } : p)}
                disabled={saving}
              />
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3.5, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} disabled={saving} sx={{ color: '#64748B', fontWeight: 700 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !canSave}
          sx={{ px: 4, fontWeight: 800 }}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}