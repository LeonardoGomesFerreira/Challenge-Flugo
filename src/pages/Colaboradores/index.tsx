import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'

import { ColaboradoresTable } from './ColaboradoresTable'
import { EditarColaboradorModal } from '../../components/EditarColaboradorModal'
import { ExcluirColaboradorModal } from '../../components/ExcluirColaboradorModal'
import {
  listarColaboradores,
  atualizarColaborador,
  excluirColaborador,
  excluirColaboradoresEmMassa,
} from '../../services/colaboradores.service'
import { listarDepartamentos } from '../../services/departamentos.service'
import type { Colaborador } from '../../types/Colaborador'
import type { Departamento } from '../../types/Departamento'

type Order = 'asc' | 'desc'
type SortKey = keyof Pick<Colaborador, 'nome' | 'email' | 'departamentoNome' | 'ativo'>

export default function Colaboradores() {
  const navigate = useNavigate()
  const [data, setData] = useState<Colaborador[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)

  const [orderBy, setOrderBy] = useState<SortKey>('nome')
  const [order, setOrder] = useState<Order>('asc')

  const [fNome, setFNome] = useState('')
  const [fEmail, setFEmail] = useState('')
  const [fDeptId, setFDeptId] = useState('')

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [editModal, setEditModal] = useState<{ open: boolean; colaborador: Colaborador | null }>({
    open: false,
    colaborador: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; colaboradores: Colaborador[] }>({
    open: false,
    colaboradores: [],
  })
  const [snack, setSnack] = useState<{ open: boolean; type: 'success' | 'error'; msg: string }>({
    open: false,
    type: 'success',
    msg: '',
  })

  const gestores = useMemo(
    () =>
      data
        .filter((c) => c.profissional?.nivelHierarquico === 'gestor' && c.id)
        .map((c) => ({ id: c.id!, nome: c.nome })),
    [data]
  )

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [rows, deps] = await Promise.all([listarColaboradores(), listarDepartamentos()])
      setData(rows)
      setDepartamentos(deps)
    } catch (err) {
      console.error('Erro ao carregar:', err)
      setSnack({ open: true, type: 'error', msg: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  function handleRequestSort(property: SortKey) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filtered = useMemo(() => {
    const nome = fNome.trim().toLowerCase()
    const email = fEmail.trim().toLowerCase()
    return data.filter((c) => {
      if (nome && !c.nome.toLowerCase().includes(nome)) return false
      if (email && !c.email.toLowerCase().includes(email)) return false
      if (fDeptId && c.departamentoId !== fDeptId) return false
      return true
    })
  }, [data, fNome, fEmail, fDeptId])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[orderBy], bv = b[orderBy]
      if (typeof av === 'string' && typeof bv === 'string')
        return order === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      if (typeof av === 'boolean' && typeof bv === 'boolean')
        return order === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av)
      return 0
    })
    return copy
  }, [filtered, orderBy, order])

  function handleToggleOne(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleToggleAllVisible(ids: string[], checked: boolean) {
    setSelectedIds((prev) => {
      const set = new Set(prev)
      if (checked) ids.forEach((id) => set.add(id))
      else ids.forEach((id) => set.delete(id))
      return Array.from(set)
    })
  }

  function handleEdit(colaborador: Colaborador) {
    setEditModal({ open: true, colaborador })
  }

  async function handleSaveEdit(colaborador: Colaborador) {
    if (!colaborador.id) return
    await atualizarColaborador(colaborador.id, colaborador)
    setSnack({ open: true, type: 'success', msg: 'Colaborador atualizado com sucesso!' })
    setEditModal({ open: false, colaborador: null })
    setSelectedIds([])
    loadAll()
  }

  function handleDeleteOne(colaborador: Colaborador) {
    setDeleteModal({ open: true, colaboradores: [colaborador] })
  }

  function handleDeleteSelected() {
    const selecionados = data.filter((c) => c.id && selectedIds.includes(c.id))
    setDeleteModal({ open: true, colaboradores: selecionados })
  }

  async function handleConfirmDelete(ids: string[]) {
    if (ids.length === 1) await excluirColaborador(ids[0])
    else await excluirColaboradoresEmMassa(ids)
    setSnack({ open: true, type: 'success', msg: ids.length > 1 ? 'Colaboradores excluídos!' : 'Colaborador excluído!' })
    setDeleteModal({ open: false, colaboradores: [] })
    setSelectedIds([])
    loadAll()
  }

  const activeFilters = [fNome, fEmail, fDeptId].filter(Boolean).length

  return (
    <>
      <Box maxWidth={1200} mx="auto">

        {/* Header */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.1) 100%)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PeopleAltRoundedIcon sx={{ color: '#16A34A', fontSize: 20 }} />
              </Box>
              <Typography variant="h4" fontWeight={800} color="#0F172A">
                Colaboradores
              </Typography>
            </Stack>
            <Typography color="text.secondary" fontSize="0.9rem" ml={0.5}>
              {loading ? '...' : `${filtered.length} de ${data.length} colaborador${data.length !== 1 ? 'es' : ''}`}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<PersonAddRoundedIcon />}
            onClick={() => navigate('/colaboradores/novo')}
            sx={{
              px: 3,
              py: 1.25,
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: 2.5,
            }}
          >
            Novo Colaborador
          </Button>
        </Stack>

        {/* Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            bgcolor: '#fff',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <FilterListRoundedIcon sx={{ color: '#64748B', fontSize: 18 }} />
            <Typography fontWeight={700} fontSize="0.85rem" color="#64748B" textTransform="uppercase" letterSpacing="0.05em">
              Filtros
            </Typography>
            {activeFilters > 0 && (
              <Chip
                size="small"
                label={activeFilters}
                sx={{ bgcolor: 'rgba(34,197,94,0.12)', color: '#16A34A', height: 20, fontSize: '0.7rem', fontWeight: 800 }}
              />
            )}
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField
              placeholder="Buscar por nome..."
              value={fNome}
              onChange={(e) => setFNome(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              placeholder="Buscar por e-mail..."
              value={fEmail}
              onChange={(e) => setFEmail(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              placeholder="Departamento"
              value={fDeptId}
              onChange={(e) => setFDeptId(e.target.value)}
              fullWidth
              size="small"
              label="Departamento"
            >
              <MenuItem value="">Todos os departamentos</MenuItem>
              {departamentos.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.nome}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', minWidth: 100 }}>
              {activeFilters > 0 && (
                <Button
                  size="small"
                  onClick={() => { setFNome(''); setFEmail(''); setFDeptId('') }}
                  sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Limpar
                </Button>
              )}
              <Tooltip title={selectedIds.length ? `Excluir ${selectedIds.length} selecionado(s)` : 'Selecione colaboradores para excluir'} arrow>
                <span>
                  <IconButton
                    onClick={handleDeleteSelected}
                    disabled={!selectedIds.length}
                    sx={{
                      borderRadius: 2,
                      width: 36,
                      height: 36,
                      bgcolor: selectedIds.length ? 'rgba(239,68,68,0.08)' : 'transparent',
                      color: selectedIds.length ? '#EF4444' : '#CBD5E1',
                      border: selectedIds.length ? '1px solid rgba(239,68,68,0.2)' : '1px solid #E2E8F0',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: selectedIds.length ? 'rgba(239,68,68,0.14)' : 'transparent',
                      },
                    }}
                  >
                    <DeleteRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Stack>
        </Paper>

        {/* Tabela */}
        {loading ? (
          <Stack alignItems="center" mt={10} spacing={2}>
            <CircularProgress size={36} sx={{ color: '#22C55E' }} />
            <Typography color="text.secondary" fontSize="0.875rem">Carregando colaboradores...</Typography>
          </Stack>
        ) : sorted.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              border: '1px solid #E2E8F0',
              borderRadius: 3,
            }}
          >
            <PeopleAltRoundedIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
            <Typography fontWeight={700} color="#64748B" mb={0.5}>
              {activeFilters > 0 ? 'Nenhum resultado encontrado' : 'Nenhum colaborador cadastrado'}
            </Typography>
            <Typography color="#94A3B8" fontSize="0.875rem">
              {activeFilters > 0 ? 'Tente ajustar os filtros de busca' : 'Clique em "Novo Colaborador" para começar'}
            </Typography>
          </Paper>
        ) : (
          <ColaboradoresTable
            rows={sorted}
            orderBy={orderBy}
            order={order}
            onRequestSort={handleRequestSort}
            onEdit={handleEdit}
            onDelete={handleDeleteOne}
            selectedIds={selectedIds}
            onToggleOne={handleToggleOne}
            onToggleAllVisible={handleToggleAllVisible}
          />
        )}
      </Box>

      <EditarColaboradorModal
        open={editModal.open}
        colaborador={editModal.colaborador}
        departamentos={departamentos}
        gestores={gestores}
        onClose={() => setEditModal({ open: false, colaborador: null })}
        onSave={handleSaveEdit}
      />

      <ExcluirColaboradorModal
        open={deleteModal.open}
        colaboradores={deleteModal.colaboradores}
        onClose={() => setDeleteModal({ open: false, colaboradores: [] })}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.type} variant="filled" sx={{ borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  )
}