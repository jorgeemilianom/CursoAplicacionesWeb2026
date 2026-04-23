import { useEffect, useState } from 'react'
import { obtenerGestaciones, obtenerGestacionesPorMascota } from '../api/gestacionApi'
import { calcularSemanasGestacion } from '../utils/gestacionUtils'
import { diasHasta } from '../utils/fechas'

export function useGestacion(mascotaId) {
  const [gestaciones, setGestaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargar() {
      try {
        setLoading(true)
        setError('')
        const data = mascotaId ? await obtenerGestacionesPorMascota(mascotaId) : await obtenerGestaciones()

        if (active) {
          setGestaciones(
            data.map((gestacion) => ({
              ...gestacion,
              semanas: calcularSemanasGestacion(gestacion.fechaCruce),
              diasRestantes: diasHasta(gestacion.fechaPartoProbable),
            })),
          )
        }
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

    cargar()

    return () => {
      active = false
    }
  }, [mascotaId])

  return { gestaciones, loading, error }
}
