import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#22C55E' },
    background: { default: '#F9FAFB' },
    text: { primary: '#111827' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingLeft: 18, paddingRight: 18 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
})