import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
      contrastText: '#ffffff',
    },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#22C55E' },
    background: {
      default: '#F0F2F5',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.01em' },
    body1: { letterSpacing: '0.01em' },
    body2: { letterSpacing: '0.01em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingLeft: 20,
          paddingRight: 20,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        },
        elevation0: {
          boxShadow: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#F8FAFC',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#22C55E',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#22C55E',
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: '#E2E8F0',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          '&.Mui-focused': { color: '#16A34A' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.75rem',
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#F1F5F9',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 7 },
        thumb: { boxShadow: '0 1px 4px rgba(0,0,0,0.2)' },
        track: { borderRadius: 20 },
        switchBase: {
          '&.Mui-checked': { color: '#fff' },
          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E', opacity: 1 },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0F172A',
          borderRadius: 8,
          fontSize: '0.78rem',
          fontWeight: 600,
          padding: '6px 12px',
        },
        arrow: { color: '#0F172A' },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#CBD5E1',
          '&.Mui-checked': { color: '#22C55E' },
          '&.MuiCheckbox-indeterminate': { color: '#22C55E' },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: '#64748B',
          fontWeight: 700,
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          '&:hover': { color: '#0F172A' },
          '&.Mui-active': { color: '#16A34A' },
          '&.Mui-active .MuiTableSortLabel-icon': { color: '#16A34A' },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
        filledSuccess: { background: 'linear-gradient(135deg, #22C55E, #16A34A)' },
        filledError: { background: 'linear-gradient(135deg, #EF4444, #DC2626)' },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: { bottom: 28 },
      },
    },
  },
})