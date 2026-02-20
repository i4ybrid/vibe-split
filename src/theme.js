const cuteTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#E89AA8',
      light: '#F5C4CF',
      dark: '#D67D8A',
    },
    secondary: {
      main: '#8FC9B0',
      light: '#B8DCCB',
      dark: '#6AB394',
    },
    error: { main: '#E57373' },
    warning: { main: '#FFB74D' },
    success: { main: '#81C784' },
    background: { default: '#FFF5F7', paper: '#FFFFFF' },
    text: { primary: '#4A3540', secondary: '#7A6570', disabled: '#B8A8B0' },
    divider: '#E8DEE2',
  },
}

const gamerTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
      light: '#D4BBFF',
      dark: '#9A67EA',
    },
    secondary: {
      main: '#03DAC6',
      light: '#66FFF9',
      dark: '#00A896',
    },
    error: { main: '#CF6679' },
    warning: { main: '#FFB74D' },
    success: { main: '#03DAC6' },
    background: { default: '#0D0D0D', paper: '#1A1A1A' },
    text: { primary: '#FFFFFF', secondary: '#B3B3B3', disabled: '#666666' },
    divider: '#333333',
  },
}

const getThemeOptions = (mode) => {
  const palette = mode === 'cute' ? cuteTheme.palette : gamerTheme.palette
  
  return {
    palette,
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      h1: { fontSize: '28px', fontWeight: 700 },
      h2: { fontSize: '24px', fontWeight: 600 },
      h3: { fontSize: '20px', fontWeight: 600 },
      body1: { fontSize: '14px', fontWeight: 400 },
      body2: { fontSize: '12px', fontWeight: 400 },
      caption: { fontSize: '12px', fontWeight: 400, color: palette.text.secondary },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            backgroundImage: mode === 'cute'
              ? `
                radial-gradient(ellipse at 20% 0%, rgba(232, 154, 168, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(143, 201, 176, 0.12) 0%, transparent 50%)
              `
              : `
                radial-gradient(ellipse at 20% 0%, rgba(187, 134, 252, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(3, 218, 198, 0.06) 0%, transparent 50%)
              `,
            minHeight: '100vh',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: mode === 'cute' ? 20 : 8, padding: '8px 20px' },
          containedPrimary: {
            background: mode === 'cute'
              ? 'linear-gradient(135deg, #E89AA8 0%, #D67D8A 100%)'
              : 'linear-gradient(135deg, #BB86FC 0%, #9A67EA 100%)',
            boxShadow: mode === 'cute'
              ? '0 4px 16px rgba(232, 154, 168, 0.3)'
              : '0 4px 20px rgba(187, 134, 252, 0.3)',
            color: mode === 'cute' ? '#FFFFFF' : '#1A1625',
            '&:hover': {
              background: mode === 'cute'
                ? 'linear-gradient(135deg, #F5C4CF 0%, #E89AA8 100%)'
                : 'linear-gradient(135deg, #D4BBFF 0%, #BB86FC 100%)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', backgroundColor: palette.background.paper },
          elevation1: { boxShadow: mode === 'cute' ? '0 2px 12px rgba(74, 53, 64, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.4)' },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'filled' },
        styleOverrides: {
          root: {
            '& .MuiFilledInput-root': {
              backgroundColor: mode === 'cute' ? '#FFF5F7' : '#262626',
              borderRadius: 12,
              '&:hover': { backgroundColor: mode === 'cute' ? '#FFE4EA' : '#2A2A2A' },
              '&.Mui-focused': { backgroundColor: mode === 'cute' ? '#FFE4EA' : '#2A2A2A' },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 20 },
          filled: { backgroundColor: mode === 'cute' ? '#FFE4EA' : '#333333' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            borderRadius: 20,
            border: mode === 'cute' ? '1px solid #FFE4EA' : 'none',
            boxShadow: mode === 'cute' ? '0 2px 12px rgba(232, 154, 168, 0.1)' : 'none',
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: mode === 'cute'
              ? 'linear-gradient(135deg, #E89AA8 0%, #D67D8A 100%)'
              : 'linear-gradient(135deg, #BB86FC 0%, #9A67EA 100%)',
            boxShadow: mode === 'cute'
              ? '0 6px 20px rgba(232, 154, 168, 0.35)'
              : '0 4px 20px rgba(187, 134, 252, 0.4)',
            color: '#FFFFFF',
            '&:hover': {
              background: mode === 'cute'
                ? 'linear-gradient(135deg, #F5C4CF 0%, #E89AA8 100%)'
                : 'linear-gradient(135deg, #D4BBFF 0%, #BB86FC 100%)',
            },
          },
        },
      },
      MuiDivider: { styleOverrides: { root: { borderColor: palette.divider } } },
      MuiAvatar: {
        styleOverrides: {
          root: { backgroundColor: palette.primary.main, color: '#FFFFFF' },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'cute' ? '#FFF5F7' : '#262626',
            borderRadius: 12,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: palette.background.paper,
            border: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&:hover': { backgroundColor: mode === 'cute' ? '#FFE4EA' : palette.divider },
            '&.Mui-selected': { backgroundColor: mode === 'cute' ? '#F5C4CF' : '#444444' },
          },
        },
      },
    },
  }
}

export { getThemeOptions }
