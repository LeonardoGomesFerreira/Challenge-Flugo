import { Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Box, IconButton, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Colaborador } from '../../types/Colaborador'
import { AvatarColaborador } from '../../utils/avatarHelper'

type Order = 'asc' | 'desc'

interface Props {
  rows: Colaborador[]
  orderBy: keyof Colaborador
  order: Order
  onRequestSort: (property: keyof Colaborador) => void
  onEdit: (colaborador: Colaborador) => void
  onDelete: (colaborador: Colaborador) => void
}

export function ColaboradoresTable({ rows, orderBy, order, onRequestSort, onEdit, onDelete }: Props) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: '#fff',
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#FAFAFA' }}>
            <TableCell sx={{ py: 2.5, fontWeight: 600, color: '#6B7280', fontSize: '0.875rem' }}>
              <TableSortLabel
                active={orderBy === 'nome'}
                direction={orderBy === 'nome' ? order : 'asc'}
                onClick={() => onRequestSort('nome')}
              >
                Nome
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ py: 2.5, fontWeight: 600, color: '#6B7280', fontSize: '0.875rem' }}>
              <TableSortLabel
                active={orderBy === 'email'}
                direction={orderBy === 'email' ? order : 'asc'}
                onClick={() => onRequestSort('email')}
              >
                Email
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ py: 2.5, fontWeight: 600, color: '#6B7280', fontSize: '0.875rem' }}>
              <TableSortLabel
                active={orderBy === 'departamento'}
                direction={orderBy === 'departamento' ? order : 'asc'}
                onClick={() => onRequestSort('departamento')}
              >
                Departamento
              </TableSortLabel>
            </TableCell>

            <TableCell align="center" sx={{ py: 2.5, fontWeight: 600, color: '#6B7280', fontSize: '0.875rem' }}>
              <TableSortLabel
                active={orderBy === 'ativo'}
                direction={orderBy === 'ativo' ? order : 'asc'}
                onClick={() => onRequestSort('ativo')}
              >
                Status
              </TableSortLabel>
            </TableCell>

            <TableCell align="center" sx={{ py: 2.5, fontWeight: 600, color: '#6B7280', fontSize: '0.875rem' }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow 
              key={row.id ?? row.email} 
              hover
              sx={{
                '&:hover': {
                  bgcolor: '#F9FAFB',
                },
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <TableCell sx={{ py: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <AvatarColaborador nome={row.nome} size={40} />
                  <Box component="span" sx={{ fontWeight: 500, color: '#111827' }}>
                    {row.nome}
                  </Box>
                </Stack>
              </TableCell>

              <TableCell sx={{ py: 2.5, color: '#6B7280' }}>{row.email}</TableCell>
              <TableCell sx={{ py: 2.5, color: '#111827', fontWeight: 500 }}>{row.departamento}</TableCell>

              <TableCell align="center" sx={{ py: 2.5 }}>
                <Chip
                  size="small"
                  label={row.ativo ? 'Ativo' : 'Inativo'}
                  sx={{
                    bgcolor: row.ativo ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: row.ativo ? '#22C55E' : '#EF4444',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    px: 1.5,
                  }}
                />
              </TableCell>

              <TableCell align="center" sx={{ py: 2.5 }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="Editar colaborador">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(row)}
                      sx={{
                        color: '#3B82F6',
                        '&:hover': {
                          bgcolor: 'rgba(59, 130, 246, 0.1)',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir colaborador">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(row)}
                      sx={{
                        color: '#EF4444',
                        '&:hover': {
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}