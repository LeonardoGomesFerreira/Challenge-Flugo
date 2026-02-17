import {
  Checkbox,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import type { Colaborador } from '../../types/Colaborador'
import { AvatarColaborador } from '../../utils/avatarHelper'

type Order = 'asc' | 'desc'

interface Props {
  rows: Colaborador[]
  orderBy: keyof Pick<Colaborador, 'nome' | 'email' | 'departamentoNome' | 'ativo'>
  order: Order
  onRequestSort: (property: Props['orderBy']) => void
  onEdit: (colaborador: Colaborador) => void
  onDelete: (colaborador: Colaborador) => void
  selectedIds: string[]
  onToggleOne: (id: string) => void
  onToggleAllVisible: (ids: string[], checked: boolean) => void
}

const HEAD_CELLS = [
  { id: 'nome' as const, label: 'Nome', align: 'left' as const },
  { id: 'email' as const, label: 'E-mail', align: 'left' as const },
  { id: 'departamentoNome' as const, label: 'Departamento', align: 'left' as const },
  { id: 'ativo' as const, label: 'Status', align: 'center' as const },
]

export function ColaboradoresTable({
  rows,
  orderBy,
  order,
  onRequestSort,
  onEdit,
  onDelete,
  selectedIds,
  onToggleOne,
  onToggleAllVisible,
}: Props) {
  const visibleIds = rows.map((r) => r.id).filter(Boolean) as string[]
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))
  const someSelected = visibleIds.some((id) => selectedIds.includes(id))

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        bgcolor: '#fff',
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: '#F8FAFC',
              borderBottom: '2px solid #E2E8F0',
            }}
          >
            <TableCell padding="checkbox" sx={{ pl: 2.5 }}>
              <Checkbox
                checked={allSelected}
                indeterminate={!allSelected && someSelected}
                onChange={(e) => onToggleAllVisible(visibleIds, e.target.checked)}
                inputProps={{ 'aria-label': 'selecionar todos' }}
                size="small"
              />
            </TableCell>

            {HEAD_CELLS.map(({ id, label, align }) => (
              <TableCell
                key={id}
                align={align}
                sx={{ py: 1.75 }}
              >
                <TableSortLabel
                  active={orderBy === id}
                  direction={orderBy === id ? order : 'asc'}
                  onClick={() => onRequestSort(id)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell
              align="center"
              sx={{
                py: 1.75,
                color: '#64748B',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Ações
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const id = row.id || row.email
            const checked = row.id ? selectedIds.includes(row.id) : false
            const isSelected = checked

            return (
              <TableRow
                key={id}
                sx={{
                  bgcolor: isSelected ? 'rgba(34,197,94,0.04)' : '#fff',
                  borderLeft: isSelected ? '3px solid #22C55E' : '3px solid transparent',
                  transition: 'all 0.12s ease',
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(34,197,94,0.06)' : '#F8FAFC',
                  },
                  '&:last-child td': { border: 0 },
                  '& td': { borderColor: '#F1F5F9' },
                }}
              >
                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                  <Checkbox
                    checked={checked}
                    disabled={!row.id}
                    onChange={() => row.id && onToggleOne(row.id)}
                    inputProps={{ 'aria-label': `selecionar ${row.nome}` }}
                    size="small"
                  />
                </TableCell>

                {/* Nome + Avatar */}
                <TableCell sx={{ py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1.75}>
                    <AvatarColaborador nome={row.nome} size={38} />
                    <Box>
                      <Typography fontWeight={600} fontSize="0.9rem" color="#0F172A" lineHeight={1.3}>
                        {row.nome}
                      </Typography>
                      {row.profissional?.cargo && (
                        <Typography fontSize="0.775rem" color="#94A3B8" lineHeight={1.2}>
                          {row.profissional.cargo}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>

                {/* Email */}
                <TableCell sx={{ py: 2 }}>
                  <Typography fontSize="0.875rem" color="#64748B">
                    {row.email}
                  </Typography>
                </TableCell>

                {/* Departamento */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    size="small"
                    label={row.departamentoNome || '—'}
                    sx={{
                      bgcolor: '#F1F5F9',
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '0.775rem',
                      border: 'none',
                      height: 24,
                    }}
                  />
                </TableCell>

                {/* Status */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 5,
                      bgcolor: row.ativo ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${row.ativo ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: row.ativo ? '#22C55E' : '#EF4444',
                        boxShadow: row.ativo ? '0 0 6px rgba(34,197,94,0.6)' : '0 0 6px rgba(239,68,68,0.5)',
                      }}
                    />
                    <Typography
                      fontSize="0.775rem"
                      fontWeight={700}
                      color={row.ativo ? '#16A34A' : '#DC2626'}
                    >
                      {row.ativo ? 'Ativo' : 'Inativo'}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Ações */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <Stack direction="row" spacing={0.75} justifyContent="center">
                    <Tooltip title="Editar colaborador" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(row)}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          color: '#3B82F6',
                          border: '1px solid transparent',
                          '&:hover': {
                            bgcolor: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.2)',
                          },
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <EditRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Excluir colaborador" arrow>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(row)}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1.5,
                          color: '#EF4444',
                          border: '1px solid transparent',
                          '&:hover': {
                            bgcolor: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                          },
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <DeleteRoundedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
