import type { ReactNode } from 'react'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

const DRAWER_WIDTH = 256

interface Props {
  children: ReactNode
}

function initials(nameOrEmail: string) {
  const s = (nameOrEmail || '').trim()
  if (!s) return 'U'
  const parts = s.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const NAV_ITEMS = [
  { to: '/colaboradores', label: 'Colaboradores', icon: PeopleAltRoundedIcon },
  { to: '/departamentos', label: 'Departamentos', icon: ApartmentRoundedIcon },
]

export function AppLayout({ children }: Props) {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            background: '#0F172A',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              component="img"
              src="/flugo-logo.svg"
              alt="Flugo"
              sx={{ height: 36, width: 'auto', display: 'block' }}
            />
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.35rem',
                letterSpacing: '-0.03em',
              }}
            >
              Flugo
            </Typography>
          </Stack>
        </Box>

        {/* Label seção */}
        <Box sx={{ px: 3, mb: 1 }}>
          <Typography sx={{ color: '#475569', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Menu
          </Typography>
        </Box>

        {/* Nav — itens começam da borda esquerda, arredondamento só no lado direito */}
        <List sx={{ px: 0, flex: 1 }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to)
            return (
              <ListItemButton
                key={to}
                component={Link}
                to={to}
                selected={active}
                sx={{
                  borderRadius: '0 10px 10px 0',
                  py: 1.25,
                  mb: 0.5,
                  pl: 3,
                  color: active ? '#fff' : '#94A3B8',
                  background: active
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.15) 100%)'
                    : 'transparent',
                  border: active ? '1px solid rgba(34,197,94,0.25)' : '1px solid transparent',
                  borderLeft: 'none',
                  transition: 'all 0.15s ease',
                  mr: 2,
                  '&:hover': {
                    background: active
                      ? 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(22,163,74,0.2) 100%)'
                      : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(22,163,74,0.15) 100%)',
                  },
                  '&.Mui-selected:hover': {
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(22,163,74,0.2) 100%)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: active ? '#22C55E' : 'inherit' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.9rem',
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#22C55E',
                      boxShadow: '0 0 8px rgba(34,197,94,0.8)',
                    }}
                  />
                )}
              </ListItemButton>
            )
          })}
        </List>

        {/* User footer */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                fontSize: '0.8rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(34,197,94,0.4)',
              }}
            >
              {initials(user?.displayName || user?.email || '')}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }} noWrap>
                {user?.displayName || 'Usuário'}
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }} noWrap>
                {user?.email}
              </Typography>
            </Box>
            <Tooltip title="Sair" arrow>
              <IconButton
                onClick={() => logout()}
                size="small"
                sx={{
                  color: '#64748B',
                  '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.1)' },
                  transition: 'all 0.15s ease',
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F0F2F5',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {/* Top bar */}
        <Box
          sx={{
            px: 4,
            py: 2,
            bgcolor: '#fff',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              {initials(user?.displayName || user?.email || '')}
            </Avatar>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>
              {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}