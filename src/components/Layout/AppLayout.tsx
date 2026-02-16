import type { ReactNode } from 'react'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import { Link, useLocation } from 'react-router-dom'

const drawerWidth = 260

interface Props {
  children: ReactNode
}

export function AppLayout({ children }: Props) {
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #F3F4F6',
            bgcolor: '#FAFAFA',
          },
        }}
      >
        <Toolbar sx={{ px: 3, py: 2.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              src="/flugo-logo.svg"
              alt="Flugo"
              sx={{
                height: 32,
                width: 'auto',
              }}
            />
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#22C55E',
                letterSpacing: '-0.02em',
              }}
            >
              Flugo
            </Typography>
          </Box>
        </Toolbar>

        <List sx={{ px: 2, mt: 1 }}>
          <ListItemButton
            component={Link}
            to="/colaboradores"
            selected={location.pathname.startsWith('/colaboradores')}
            sx={{
              borderRadius: 2,
              py: 1.5,
              '&.Mui-selected': { 
                bgcolor: 'rgba(34,197,94,0.12)',
                '& .MuiListItemIcon-root': {
                  color: '#22C55E',
                },
                '& .MuiListItemText-primary': {
                  color: '#22C55E',
                  fontWeight: 600,
                },
              },
              '&:hover': {
                bgcolor: 'rgba(34,197,94,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 42 }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Colaboradores"
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 5,
          bgcolor: '#F9FAFB',
          overflow: 'hidden',
          height: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}