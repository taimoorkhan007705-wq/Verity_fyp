import styled from 'styled-components'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const ToggleButton = styled.button`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.textPrimary};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: rotate(20deg);
  }
`

function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <ToggleButton onClick={toggleTheme} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </ToggleButton>
  )
}

export default DarkModeToggle

