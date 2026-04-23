import { createContext, useEffect, useState } from 'react'
import {
  actualizarMascotaApi,
  crearMascota,
  eliminarMascotaApi,
  obtenerMascotasPorUsuario,
} from '../../ArchivosJS/api/mascotasApi'
import { STORAGE_KEYS } from '../../ArchivosJS/utils/constants'
import { useUser } from '../../ArchivosJS/hooks/useUser'

// eslint-disable-next-line react-refresh/only-export-components
export const MascotaContext = createContext(null)

export function MascotaProvider({ children }) {
  const { user } = useUser()
  const [mascotas, setMascotas] = useState([])
  const [mascotaActiva, setMascotaActiva] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargarMascotas() {
      if (!user) {
        setMascotas([])
        setMascotaActiva(null)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await obtenerMascotasPorUsuario(user.id)

        if (!active) return

        setMascotas(data)
        const savedId = Number(localStorage.getItem(STORAGE_KEYS.activePetId))
        const selected = data.find((mascota) => mascota.id === savedId) || data[0] || null
        setMascotaActiva(selected)
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    cargarMascotas()

    return () => {
      active = false
    }
  }, [user])

  function seleccionarMascota(id) {
    const selected = mascotas.find((mascota) => mascota.id === Number(id)) || null
    setMascotaActiva(selected)

    if (selected) {
      localStorage.setItem(STORAGE_KEYS.activePetId, String(selected.id))
    } else {
      localStorage.removeItem(STORAGE_KEYS.activePetId)
    }
  }

  async function agregarMascota(datos) {
    if (!user) throw new Error('Necesitas iniciar sesion.')

    const nuevaMascota = await crearMascota({
      ...datos,
      usuarioId: user.id,
      activo: true,
    })

    setMascotas((prev) => [...prev, nuevaMascota])
    setMascotaActiva((prev) => prev || nuevaMascota)
    localStorage.setItem(STORAGE_KEYS.activePetId, String(nuevaMascota.id))
    return nuevaMascota
  }

  async function actualizarMascota(id, datos) {
    const mascotaActualizada = await actualizarMascotaApi(id, datos)
    setMascotas((prev) => prev.map((mascota) => (mascota.id === Number(id) ? mascotaActualizada : mascota)))
    setMascotaActiva((prev) => (prev?.id === Number(id) ? mascotaActualizada : prev))
    return mascotaActualizada
  }

  async function eliminarMascota(id) {
    await eliminarMascotaApi(id)
    setMascotas((prev) => {
      const nextMascotas = prev.filter((mascota) => mascota.id !== Number(id))
      const nextActive = nextMascotas[0] || null
      setMascotaActiva(nextActive)

      if (nextActive) {
        localStorage.setItem(STORAGE_KEYS.activePetId, String(nextActive.id))
      } else {
        localStorage.removeItem(STORAGE_KEYS.activePetId)
      }

      return nextMascotas
    })
  }

  const value = {
    mascotas,
    mascotaActiva,
    loading,
    error,
    seleccionarMascota,
    agregarMascota,
    actualizarMascota,
    eliminarMascota,
    setMascotaActiva,
  }

  return <MascotaContext.Provider value={value}>{children}</MascotaContext.Provider>
}
