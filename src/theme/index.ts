import { alpha, createTheme } from '@mui/material/styles'

const colors = {
  primary: '#BD93F9',
  secondary: '#FF79C6',
  success: '#50FA7B',
  warning: '#FFB86C',
  danger: '#FF5555',
  background: '#F8F8FC',
  surface: '#FFFFFF',
  border: '#E8E8F3',
  text: '#2B2D42',
  textLight: '#6C6F93',
} as const

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      light: '#D4B5FB',
      dark: '#A071E8',
      contrastText: colors.text,
    },
    secondary: {
      main: colors.secondary,
      light: '#FF9DD4',
      dark: '#E85AAC',
      contrastText: colors.text,
    },
    success: {
      main: colors.success,
      light: '#7DFB9A',
      dark: '#3DD965',
      contrastText: colors.text,
    },
    warning: {
      main: colors.warning,
      light: '#FFCA94',
      dark: '#E89E50',
      contrastText: colors.text,
    },
    error: {
      main: colors.danger,
      light: '#FF8080',
      dark: '#E04444',
      contrastText: colors.surface,
    },
    info: {
      main: '#A071E8',
      light: '#D4B5FB',
      dark: '#8B5FD6',
      contrastText: colors.text,
    },
    text: {
      primary: colors.text,
      secondary: colors.textLight,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    divider: colors.border,
    action: {
      active: colors.textLight,
      hover: alpha(colors.primary, 0.06),
      selected: alpha(colors.primary, 0.1),
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: `0 1px 3px ${alpha(colors.text, 0.06)}`,
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: colors.border,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          bgcolor: alpha(colors.primary, 0.12),
        },
        bar: {
          bgcolor: colors.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.border}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
  },
})

export { colors }
