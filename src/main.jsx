import React, { useState, useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import App from './App'
import { getThemeOptions } from './theme'

const THEME_STORAGE_KEY = 'vibe-split-theme-mode'

function Root() {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved || 'cute'
  })

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)
  }, [themeMode])

  const theme = useMemo(() => createTheme(getThemeOptions(themeMode)), [themeMode])

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'cute' ? 'gamer' : 'cute')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App themeMode={themeMode} onToggleTheme={toggleTheme} />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
