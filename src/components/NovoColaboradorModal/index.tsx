import { Dialog, DialogContent, DialogTitle, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface Props {
  open: boolean
  onClose: () => void
}

export function NovoColaboradorModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 900 }}>Novo Colaborador</DialogTitle>
      <DialogContent>
        <Typography color="#6B7280" mb={3}>
          O cadastro completo (com validações, UX e campos profissionais) está disponível na página dedicada.
        </Typography>

        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button onClick={onClose} sx={{ color: '#6B7280', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button component={RouterLink} to="/colaboradores/novo" variant="contained" onClick={onClose} sx={{ fontWeight: 900, borderRadius: 2, px: 3 }}>
            Abrir cadastro
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
