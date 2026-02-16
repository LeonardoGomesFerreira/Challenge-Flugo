import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Switch,
  Stack,
  Typography,
  Alert,
} from '@mui/material'
import type { Colaborador } from '../types/Colaborador'

interface Props {
  open: boolean
  colaborador: Colaborador | null
  onClose: () => void
  onSave: (colaborador: Colaborador) => Promise<void>
}

export function EditarColaboradorModal({ open, colaborador, onClose, onSave }: Props) {
  const [departamento, setDepartamento] = useState(colaborador?.departamento || '')
  const [ativo, setAtivo] = useState(colaborador?.ativo ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Atualizar estado quando o colaborador mudar
  useState(() => {
    if (colaborador) {
      setDepartamento(colaborador.departamento)
      setAtivo(colaborador.ativo)
    }
  })

  const handleSave = async () => {
    if (!colaborador) return

    // Validação
    if (!departamento) {
      setError('Departamento é obrigatório')
      return
    }

    setError('')
    setSaving(true)

    try {
      await onSave({
        ...colaborador,
        departamento,
        ativo,
      })
      onClose()
    } catch (err) {
      setError('Erro ao salvar alterações. Tente novamente.')
      console.error('Erro ao editar colaborador:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (!saving) {
      setError('')
      onClose()
    }
  }

  if (!colaborador) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
        Editar Colaborador
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3} mt={2}>
          {/* Nome (somente leitura) */}
          <TextField
            label="Nome"
            value={colaborador.nome}
            disabled
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Email (somente leitura) */}
          <TextField
            label="E-mail"
            value={colaborador.email}
            disabled
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Departamento (editável) */}
          <TextField
            select
            label="Departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            fullWidth
            required
            error={!departamento && error !== ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="TI">TI</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Produto">Produto</MenuItem>
          </TextField>

          {/* Status (editável) */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Switch
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              disabled={saving}
            />
            <Typography fontWeight={500}>
              {ativo ? 'Colaborador Ativo' : 'Colaborador Inativo'}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={saving} sx={{ color: '#6B7280' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ px: 4 }}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}