import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      // Decodifica el token para obtener datos básicos del usuario
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.sub })
      } catch {
        logout()
      }
    }
  }, [token])

  const loginUser = (accessToken) => {
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)