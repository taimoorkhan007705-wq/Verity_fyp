import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Dummy user data (you can replace with real authentication later)
  const [user, setUser] = useState({
    name: 'Great Stack',
    email: 'user.greatstack@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    username: '@john_warren'
  })

  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
