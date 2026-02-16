import { useEffect, useMemo, useState } from 'react'
import { Button, CircularProgress, Stack, Typography, Box, Snackbar, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ColaboradoresTable } from './ColaboradoresTable'
import { EditarColaboradorModal } from '../../components/EditarColaboradorModal'
import { ExcluirColaboradorModal } from '../../components/ExcluirColaboradorModal'
import { listarColaboradores, atualizarColaborador, excluirColaborador } from '../../services/colaboradores.service'
import type { Colaborador } from '../../types/Colaborador'

export default function Colaboradores() {
  const navigate = useNavigate()
  const [data, setData] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)

  const [orderBy, setOrderBy] = useState<keyof Colaborador>('nome')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  // Estados dos modais
  const [editModal, setEditModal] = useState<{ open: boolean; colaborador: Colaborador | null }>({
    open: false,
    colaborador: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; colaborador: Colaborador | null }>({
    open: false,
    colaborador: null,
  })

  // Snackbar
  const [snack, setSnack] = useState<{ open: boolean; type: 'success' | 'error'; msg: string }>({
    open: false,
    type: 'success',
    msg: '',
  })

  useEffect(() => {
    loadColaboradores()
  }, [])

  async function loadColaboradores() {
    setLoading(true)
    try {
      const rows = await listarColaboradores()
      setData(rows)
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err)
      setSnack({ open: true, type: 'error', msg: 'Erro ao carregar colaboradores' })
    } finally {
      setLoading(false)
    }
  }

  function handleRequestSort(property: keyof Colaborador) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sorted = useMemo(() => {
    const copy = [...data]
    copy.sort((a, b) => {
      const av = a[orderBy]
      const bv = b[orderBy]
      if (typeof av === 'string' && typeof bv === 'string') {
        return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      if (typeof av === 'boolean' && typeof bv === 'boolean') {
        return order === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av)
      }
      return 0
    })
    return copy
  }, [data, orderBy, order])

  // Handlers para edição
  function handleEdit(colaborador: Colaborador) {
    setEditModal({ open: true, colaborador })
  }

  async function handleSaveEdit(colaborador: Colaborador) {
    if (!colaborador.id) return

    await atualizarColaborador(colaborador.id, {
      departamento: colaborador.departamento,
      ativo: colaborador.ativo,
    })

    setSnack({ open: true, type: 'success', msg: 'Colaborador atualizado com sucesso!' })
    setEditModal({ open: false, colaborador: null })
    loadColaboradores()
  }

  // Handlers para exclusão
  function handleDelete(colaborador: Colaborador) {
    setDeleteModal({ open: true, colaborador })
  }

  async function handleConfirmDelete(id: string) {
    await excluirColaborador(id)

    setSnack({ open: true, type: 'success', msg: 'Colaborador excluído com sucesso!' })
    setDeleteModal({ open: false, colaborador: null })
    loadColaboradores()
  }

  return (
    <>
      <Box maxWidth={1200} mx="auto">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" fontWeight={700}>
            Colaboradores
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/colaboradores/novo')}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            Novo Colaborador
          </Button>
        </Stack>

        {loading ? (
          <Stack alignItems="center" mt={8}>
            <CircularProgress />
          </Stack>
        ) : (
          <ColaboradoresTable
            rows={sorted}
            orderBy={orderBy}
            order={order}
            onRequestSort={handleRequestSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Box>

      {/* Modal de Edição */}
      <EditarColaboradorModal
        open={editModal.open}
        colaborador={editModal.colaborador}
        onClose={() => setEditModal({ open: false, colaborador: null })}
        onSave={handleSaveEdit}
      />

      {/* Modal de Exclusão */}
      <ExcluirColaboradorModal
        open={deleteModal.open}
        colaborador={deleteModal.colaborador}
        onClose={() => setDeleteModal({ open: false, colaborador: null })}
        onConfirm={handleConfirmDelete}
      />

      {/* Snackbar de Feedback */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.type} variant="filled" sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  )
}