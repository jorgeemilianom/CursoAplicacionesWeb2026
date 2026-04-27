import { useEffect, useState } from 'react'
import { geocodificarCiudad, obtenerVeterinariasCercanas } from '../api/externalApis'

function fallbackPosition() {
  return {
    lat: -27.3621,
    lng: -55.9009,
    label: 'Posadas, Misiones',
  }
}

export function useVeterinarias(lat = null, lng = null, radio = 5000) {
  const [veterinarias, setVeterinarias] = useState([])
  const [posicion, setPosicion] = useState(lat && lng ? { lat, lng, label: 'Ubicacion actual' } : fallbackPosition())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (lat && lng) {
      setPosicion({ lat, lng, label: 'Ubicacion actual' })
      return
    }

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalizacion. Puedes buscar con la ubicacion por defecto.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosicion({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Tu ubicacion',
        })
      },
      () => {
        setError('No se pudo obtener tu ubicacion. Puedes buscar en la zona por defecto.')
      },
    )
  }, [lat, lng])

  useEffect(() => {
    let active = true

    async function cargarVeterinarias() {
      if (!posicion?.lat || !posicion?.lng) return

      try {
        setLoading(true)
        setError('')
        const data = await obtenerVeterinariasCercanas(posicion.lat, posicion.lng, radio)
        if (active) {
          setVeterinarias(data.filter((item) => item.lat && item.lng))
        }
      } catch (err) {
        if (active) {
          setError(err.message)
          setVeterinarias([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    cargarVeterinarias()

    return () => {
      active = false
    }
  }, [posicion, radio])

  return {
    veterinarias,
    posicion,
    loading,
    error,
    setPosicion,
    buscarPorCiudad: async (ciudad) => {
      const resultado = await geocodificarCiudad(ciudad)
      setPosicion(resultado)
      return resultado
    },
  }
}
