import { createContext, useEffect, useState } from 'react'
import axiosConfig from '../../ArchivosJS/api/axiosConfig'
import { STORAGE_KEYS } from '../../ArchivosJS/utils/constants'

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.user)
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
      localStorage.setItem(STORAGE_KEYS.token, `petbook-token-${user.id}`)
      return
    }

    localStorage.removeItem(STORAGE_KEYS.user)
    localStorage.removeItem(STORAGE_KEYS.token)
  }, [user])

  async function login(email, password) {
    setLoading(true)
    setError('')

    try {
      const { data } = await axiosConfig.get(`/usuarios?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      const foundUser = data[0]

      if (!foundUser) {
        throw new Error('Credenciales invalidas.')
      }

      setUser(foundUser)
      return foundUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.activePetId)
  }

  async function registrarUsuario(datos) {
    setLoading(true)
    setError('')

    try {
      const { data: existentes } = await axiosConfig.get(`/usuarios?email=${encodeURIComponent(datos.email)}`)

      if (existentes.length > 0) {
        throw new Error('Ya existe un usuario registrado con ese email.')
      }

      const { data } = await axiosConfig.post('/usuarios', datos)
      setUser(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    login,
    logout,
    registrarUsuario,
    clearUserError: () => setError(''),
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
