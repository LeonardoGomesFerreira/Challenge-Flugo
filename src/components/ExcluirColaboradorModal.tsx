import { useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  Stack,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import type { Colaborador } from '../types/Colaborador'

interface Props {
  open: boolean
  colaboradores: Colaborador[]
  onClose: () => void
  onConfirm: (ids: string[]) => Promise<void>
}

export function ExcluirColaboradorModal({ open, colaboradores, onClose, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const ids = useMemo(() => colaboradores.map((c) => c.id).filter(Boolean) as string[], [colaboradores])
  const count = ids.length

  const title = count > 1 ? 'Excluir colaboradores' : 'Excluir colaborador'

  const handleConfirm = async () => {
    if (!count) return

    setError('')
    setDeleting(true)

    try {
      await onConfirm(ids)
      onClose()
    } catch (err) {
      setError('Erro ao excluir. Tente novamente.')
      console.error('Erro ao excluir colaborador(es):', err)
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, fontSize: '1.25rem', pb: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 28 }} />
          {title}
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {count === 1 ? (
          <Typography fontSize="1rem" color="text.secondary" mb={2}>
            Tem certeza que deseja excluir o colaborador{' '}
            <Typography component="span" fontWeight={900} color="text.primary">
              {colaboradores[0]?.nome}
            </Typography>
            ?
          </Typography>
        ) : (
          <Stack spacing={1} mb={2}>
            <Typography fontSize="1rem" color="text.secondary">
              Você está prestes a excluir{' '}
              <Typography component="span" fontWeight={900} color="text.primary">
                {count} colaboradores
              </Typography>
              .
            </Typography>
            <Typography fontSize="0.9rem" color="#9CA3AF">
              Dica: revise a seleção — essa ação é permanente.
            </Typography>
          </Stack>
        )}

        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          <Typography fontWeight={800} mb={0.5}>
            Esta ação não pode ser desfeita!
          </Typography>
          <Typography fontSize="0.875rem">
            Os dados selecionados serão permanentemente removidos do sistema.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={deleting} sx={{ color: '#6B7280', fontWeight: 700 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={deleting || !count}
          sx={{
            px: 4,
            borderRadius: 2,
            bgcolor: '#EF4444',
            fontWeight: 900,
            '&:hover': { bgcolor: '#DC2626' },
          }}
        >
          {deleting ? 'Excluindo...' : count > 1 ? 'Excluir selecionados' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
