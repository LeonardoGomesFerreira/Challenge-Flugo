import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Avatar,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

import type { Departamento } from '../../types/Departamento'
import type { Colaborador } from '../../types/Colaborador'
import {
  listarDepartamentos,
  criarDepartamento,
  atualizarDepartamento,
  excluirDepartamento,
} from '../../services/departamentos.service'
import { listarColaboradores, atualizarColaborador } from '../../services/colaboradores.service'

// ── Modal criar / editar ──────────────────────────────────────────────
function DeptModal({
  open, mode, colaboradores, initial, onClose, onSaved,
}: {
  open: boolean
  mode: 'create' | 'edit'
  colaboradores: Colaborador[]
  initial?: Departamento | null
  onClose: () => void
  onSaved: () => void
}) {
  const [nome, setNome] = useState('')
  const [gestorId, setGestorId] = useState('')
  const [selectedColabs, setSelectedColabs] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const gestores = useMemo(
    () => colaboradores.filter((c) => c.profissional?.nivelHierarquico === 'gestor' && c.id),
    [colaboradores]
  )

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initial) {
      setNome(initial.nome)
      setGestorId(initial.gestorId || '')
      setSelectedColabs(initial.colaboradorIds || [])
    } else {
      setNome('')
      setGestorId('')
      setSelectedColabs([])
    }
    setError('')
  }, [open, mode, initial])

  const canSave = useMemo(() => {
    if (!nome.trim()) return false
    if (gestores.length && !gestorId) return false
    return true
  }, [nome, gestorId, gestores.length])

  async function handleSave() {
    setError('')
    if (!canSave) { setError('Revise os campos obrigatórios.'); return }
    setSaving(true)
    try {
      if (mode === 'create') {
        const deptId = await criarDepartamento({ nome: nome.trim(), gestorId: gestorId || '', colaboradorIds: [] })
        for (const colId of selectedColabs) {
          await atualizarColaborador(colId, { departamentoId: deptId, departamentoNome: nome.trim() })
        }
      } else if (mode === 'edit' && initial?.id) {
        await atualizarDepartamento(initial.id, { nome: nome.trim(), gestorId: gestorId || '' })
        if (nome.trim() !== initial.nome) {
          for (const colId of (initial.colaboradorIds || [])) {
            await atualizarColaborador(colId, { departamentoNome: nome.trim() })
          }
        }
        const prev = new Set(initial.colaboradorIds || [])
        for (const colId of selectedColabs.filter((id) => !prev.has(id))) {
          await atualizarColaborador(colId, { departamentoId: initial.id, departamentoNome: nome.trim() })
        }
      }
      onSaved()
      onClose()
    } catch (e) {
      console.error(e)
      setError('Não foi possível salvar. Verifique o console.')
    } finally {
      setSaving(false)
    }
  }

  const colabOptions = useMemo(() => colaboradores.filter((c) => c.id), [colaboradores])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, pb: 1, pt: 3, px: 3.5 }}>
        {mode === 'create' ? 'Novo Departamento' : 'Editar Departamento'}
      </DialogTitle>

      <DialogContent sx={{ px: 3.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>
        )}

        <Stack spacing={2.5} mt={1}>
          <TextField
            label="Nome do departamento"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            select
            label="Gestor responsável"
            value={gestorId}
            onChange={(e) => setGestorId(e.target.value)}
            fullWidth
            required={gestores.length > 0}
            disabled={!gestores.length}
            helperText={
              !gestores.length
                ? 'Cadastre ao menos 1 colaborador com nível "Gestor".'
                : ''
            }
          >
            <MenuItem value="">(Sem gestor)</MenuItem>
            {gestores.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={mode === 'create' ? 'Adicionar colaboradores' : 'Adicionar mais colaboradores'}
            value=""
            onChange={(e) => {
              const id = e.target.value
              if (!id) return
              setSelectedColabs((prev) => (prev.includes(id) ? prev : [...prev, id]))
            }}
            fullWidth
          >
            <MenuItem value="">Selecione um colaborador...</MenuItem>
            {colabOptions.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nome} · {c.departamentoNome}
              </MenuItem>
            ))}
          </TextField>

          {!!selectedColabs.length && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <GroupsRoundedIcon sx={{ color: '#64748B', fontSize: 18 }} />
                <Typography fontWeight={700} fontSize="0.85rem" color="#475569">
                  {selectedColabs.length} colaborador{selectedColabs.length !== 1 ? 'es' : ''} no departamento
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {selectedColabs.map((id) => {
                  const c = colaboradores.find((x) => x.id === id)
                  return (
                    <Chip
                      key={id}
                      label={c?.nome || id}
                      size="small"
                      onDelete={mode === 'create' ? () => setSelectedColabs((prev) => prev.filter((x) => x !== id)) : undefined}
                      sx={{
                        bgcolor: 'rgba(34,197,94,0.1)',
                        color: '#16A34A',
                        fontWeight: 600,
                        border: '1px solid rgba(34,197,94,0.2)',
                        '& .MuiChip-deleteIcon': { color: '#16A34A' },
                      }}
                    />
                  )
                })}
              </Stack>
              {mode === 'edit' && (
                <Typography color="#94A3B8" fontSize="0.78rem" mt={1.5}>
                  Para transferir colaboradores, edite o colaborador diretamente.
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3.5, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={saving} sx={{ color: '#64748B', fontWeight: 700 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave || saving}
          sx={{ px: 4, fontWeight: 800 }}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Página principal ──────────────────────────────────────────────────
export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [fNome, setFNome] = useState('')

  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; dept: Departamento | null }>({
    open: false, mode: 'create', dept: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; dept: Departamento | null }>({
    open: false, dept: null,
  })
  const [snack, setSnack] = useState<{ open: boolean; type: 'success' | 'error'; msg: string }>({
    open: false, type: 'success', msg: '',
  })

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [deps, cols] = await Promise.all([listarDepartamentos(), listarColaboradores()])
      setDepartamentos(deps)
      setColaboradores(cols)
    } catch (e) {
      console.error(e)
      setSnack({ open: true, type: 'error', msg: 'Erro ao carregar dados' })
    } finally {
      setLoading(false)
    }
  }

  const gestoresById = useMemo(() => {
    const map = new Map<string, string>()
    colaboradores.forEach((c) => { if (c.id) map.set(c.id, c.nome) })
    return map
  }, [colaboradores])

  const filtered = useMemo(() => {
    const n = fNome.trim().toLowerCase()
    if (!n) return departamentos
    return departamentos.filter((d) => d.nome.toLowerCase().includes(n))
  }, [departamentos, fNome])

  async function handleDeleteDept() {
    const dept = deleteModal.dept
    if (!dept?.id) return
    try {
      await excluirDepartamento(dept.id)
      setSnack({ open: true, type: 'success', msg: 'Departamento excluído!' })
      setDeleteModal({ open: false, dept: null })
      loadAll()
    } catch (e) {
      console.error(e)
      setSnack({ open: true, type: 'error', msg: 'Não foi possível excluir.' })
    }
  }

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
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.1) 100%)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ApartmentRoundedIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
              </Box>
              <Typography variant="h4" fontWeight={800} color="#0F172A">
                Departamentos
              </Typography>
            </Stack>
            <Typography color="text.secondary" fontSize="0.9rem" ml={0.5}>
              {loading ? '...' : `${filtered.length} de ${departamentos.length} departamento${departamentos.length !== 1 ? 's' : ''}`}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setModal({ open: true, mode: 'create', dept: null })}
            sx={{ px: 3, py: 1.25, fontWeight: 700 }}
          >
            Novo Departamento
          </Button>
        </Stack>

        {/* Filtro */}
        <Paper
          elevation={0}
          sx={{ p: 2.5, mb: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#fff' }}
        >
          <TextField
            placeholder="Buscar departamento..."
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
        </Paper>

        {/* Tabela */}
        {loading ? (
          <Stack alignItems="center" mt={10} spacing={2}>
            <CircularProgress size={36} sx={{ color: '#22C55E' }} />
            <Typography color="text.secondary" fontSize="0.875rem">Carregando departamentos...</Typography>
          </Stack>
        ) : filtered.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <ApartmentRoundedIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
            <Typography fontWeight={700} color="#64748B" mb={0.5}>
              {fNome ? 'Nenhum resultado encontrado' : 'Nenhum departamento cadastrado'}
            </Typography>
            <Typography color="#94A3B8" fontSize="0.875rem">
              {fNome ? 'Tente ajustar o filtro de busca' : 'Clique em "Novo Departamento" para começar'}
            </Typography>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ bgcolor: '#fff', borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  {['Nome', 'Gestor Responsável', 'Colaboradores', 'Ações'].map((h, i) => (
                    <TableCell
                      key={h}
                      align={i >= 2 ? 'center' : 'left'}
                      sx={{
                        py: 1.75,
                        color: '#64748B',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((d) => {
                  const canDelete = !(d.colaboradorIds?.length)
                  const gestorNome = d.gestorId ? gestoresById.get(d.gestorId) : null
                  const count = d.colaboradorIds?.length || 0

                  return (
                    <TableRow
                      key={d.id}
                      sx={{
                        transition: 'background 0.12s ease',
                        '&:hover': { bgcolor: '#F8FAFC' },
                        '&:last-child td': { border: 0 },
                        '& td': { borderColor: '#F1F5F9' },
                      }}
                    >
                      {/* Nome */}
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.08) 100%)',
                              border: '1px solid rgba(59,130,246,0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <ApartmentRoundedIcon sx={{ color: '#3B82F6', fontSize: 16 }} />
                          </Box>
                          <Typography fontWeight={700} fontSize="0.9rem" color="#0F172A">
                            {d.nome}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Gestor */}
                      <TableCell sx={{ py: 2 }}>
                        {gestorNome ? (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                              }}
                            >
                              {gestorNome.slice(0, 1)}
                            </Avatar>
                            <Typography fontSize="0.875rem" color="#475569" fontWeight={500}>
                              {gestorNome}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography fontSize="0.875rem" color="#CBD5E1">
                            Não atribuído
                          </Typography>
                        )}
                      </TableCell>

                      {/* Colaboradores */}
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 5,
                            bgcolor: count > 0 ? 'rgba(34,197,94,0.1)' : '#F1F5F9',
                            border: `1px solid ${count > 0 ? 'rgba(34,197,94,0.25)' : '#E2E8F0'}`,
                          }}
                        >
                          <GroupsRoundedIcon sx={{ fontSize: 14, color: count > 0 ? '#16A34A' : '#94A3B8' }} />
                          <Typography
                            fontSize="0.8rem"
                            fontWeight={700}
                            color={count > 0 ? '#16A34A' : '#94A3B8'}
                          >
                            {count}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Ações */}
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Stack direction="row" spacing={0.75} justifyContent="center">
                          <Tooltip title="Editar departamento" arrow>
                            <IconButton
                              size="small"
                              onClick={() => setModal({ open: true, mode: 'edit', dept: d })}
                              sx={{
                                width: 32, height: 32, borderRadius: 1.5,
                                color: '#3B82F6',
                                border: '1px solid transparent',
                                '&:hover': { bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' },
                                transition: 'all 0.12s ease',
                              }}
                            >
                              <EditRoundedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              canDelete
                                ? 'Excluir departamento'
                                : 'Transfira os colaboradores antes de excluir'
                            }
                            arrow
                          >
                            <span>
                              <IconButton
                                size="small"
                                disabled={!canDelete}
                                onClick={() => setDeleteModal({ open: true, dept: d })}
                                sx={{
                                  width: 32, height: 32, borderRadius: 1.5,
                                  color: canDelete ? '#EF4444' : '#CBD5E1',
                                  border: '1px solid transparent',
                                  '&:hover': {
                                    bgcolor: canDelete ? 'rgba(239,68,68,0.1)' : 'transparent',
                                    border: canDelete ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                                  },
                                  transition: 'all 0.12s ease',
                                }}
                              >
                                <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Modal criar/editar */}
      <DeptModal
        open={modal.open}
        mode={modal.mode}
        colaboradores={colaboradores}
        initial={modal.dept}
        onClose={() => setModal({ open: false, mode: 'create', dept: null })}
        onSaved={() => {
          setSnack({
            open: true, type: 'success',
            msg: modal.mode === 'create' ? 'Departamento criado!' : 'Departamento atualizado!',
          })
          loadAll()
        }}
      />

      {/* Dialog excluir */}
      <Dialog
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, dept: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, pt: 3, px: 3.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: 'rgba(239,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmberRoundedIcon sx={{ color: '#EF4444', fontSize: 22 }} />
            </Box>
            <span>Excluir Departamento</span>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3.5 }}>
          <Typography color="#475569" lineHeight={1.7}>
            Tem certeza que deseja excluir o departamento{' '}
            <Typography component="span" fontWeight={800} color="#0F172A">
              {deleteModal.dept?.nome}
            </Typography>
            ? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3.5, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteModal({ open: false, dept: null })}
            sx={{ color: '#64748B', fontWeight: 700 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteDept}
            sx={{
              bgcolor: '#EF4444',
              '&:hover': { bgcolor: '#DC2626' },
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              fontWeight: 800,
              px: 3,
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.type} variant="filled" sx={{ borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  )
}