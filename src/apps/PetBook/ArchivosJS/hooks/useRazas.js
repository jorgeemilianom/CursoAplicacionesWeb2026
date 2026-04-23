import { useEffect, useState } from 'react'
import { obtenerRazas } from '../api/externalApis'
import { FALLBACK_RAZAS } from '../utils/constants'

export function useRazas(especie) {
  const [razas, setRazas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargarRazas() {
      if (!especie) {
        setRazas([])
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await obtenerRazas(especie)

        if (active) {
          setRazas(data)
        }
      } catch {
        if (active) {
          setRazas(FALLBACK_RAZAS[especie] || FALLBACK_RAZAS.otro)
          setError('No se pudo cargar el catalogo externo. Se usan opciones locales.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    cargarRazas()

    return () => {
      active = false
    }
  }, [especie])

  return { razas, loading, error }
}
