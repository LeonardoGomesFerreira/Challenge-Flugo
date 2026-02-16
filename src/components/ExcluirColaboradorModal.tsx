import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import type { Colaborador } from '../types/Colaborador'

interface Props {
  open: boolean
  colaborador: Colaborador | null
  onClose: () => void
  onConfirm: (id: string) => Promise<void>
}

export function ExcluirColaboradorModal({ open, colaborador, onClose, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!colaborador?.id) return

    setError('')
    setDeleting(true)

    try {
      await onConfirm(colaborador.id)
      onClose()
    } catch (err) {
      setError('Erro ao excluir colaborador. Tente novamente.')
      console.error('Erro ao excluir colaborador:', err)
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    if (!deleting) {
      setError('')
      onClose()
    }
  }

  if (!colaborador) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', pb: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 28 }} />
          Confirmar Exclusão
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Typography fontSize="1rem" color="text.secondary" mb={2}>
          Tem certeza que deseja excluir o colaborador{' '}
          <Typography component="span" fontWeight={700} color="text.primary">
            {colaborador.nome}
          </Typography>
          ?
        </Typography>

        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography fontWeight={600} mb={0.5}>
            Esta ação não pode ser desfeita!
          </Typography>
          <Typography fontSize="0.875rem">
            Todos os dados do colaborador serão permanentemente removidos do sistema.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={deleting} sx={{ color: '#6B7280' }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={deleting}
          sx={{
            px: 4,
            bgcolor: '#EF4444',
            '&:hover': {
              bgcolor: '#DC2626',
            },
          }}
        >
          {deleting ? 'Excluindo...' : 'Excluir Colaborador'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}