/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const lightTheme = {
  mode: 'light',
  colors: {
    // Backgrounds
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    
    // Text
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Brand colors
    primary: '#14b8a6',
    primaryHover: '#0d9488',
    primaryLight: '#ccfbf1',
    
    // Status colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowHeavy: 'rgba(0, 0, 0, 0.2)',
  }
}

export const darkTheme = {
  mode: 'dark',
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    textPrimary: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    border: '#334155',
    borderLight: '#475569',
    primary: '#14b8a6',
    primaryHover: '#0d9488',
    primaryLight: '#134e4a',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.4)',
    shadowHeavy: 'rgba(0, 0, 0, 0.5)'
  }
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    // Update body background for smooth transition
    document.body.style.backgroundColor = isDarkMode ? darkTheme.colors.background : lightTheme.colors.background
    document.body.style.color = isDarkMode ? darkTheme.colors.textPrimary : lightTheme.colors.textPrimary
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const theme = isDarkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

