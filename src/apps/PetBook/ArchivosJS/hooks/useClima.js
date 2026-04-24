import { useEffect, useMemo, useState } from 'react'
import { obtenerClimaActual } from '../api/externalApis'

function generarConsejoMascota(temp, condicion = '', humedad = 0) {
  const condicionTexto = String(condicion || '').toLowerCase()

  if (temp >= 35) {
    return {
      icono: 'Calor',
      alerta: 'alta',
      mensaje: 'Calor extremo: evita paseos al mediodia y deja agua fresca siempre disponible.',
    }
  }

  if (temp >= 28) {
    return {
      icono: 'Sol',
      alerta: 'media',
      mensaje: 'Dia caluroso: mejor salir temprano o al atardecer y en paseos cortos.',
    }
  }

  if (temp <= 5) {
    return {
      icono: 'Frio',
      alerta: 'media',
      mensaje: 'Hace frio: abriga a tu mascota si es sensible y evita superficies muy frias.',
    }
  }

  if (condicionTexto.includes('rain') || condicionTexto.includes('lluvia')) {
    return {
      icono: 'Lluvia',
      alerta: 'baja',
      mensaje: 'Dia lluvioso: seca bien patas y pelaje para evitar humedad y hongos.',
    }
  }

  if (humedad > 80) {
    return {
      icono: 'Humedad',
      alerta: 'baja',
      mensaje: 'Alta humedad: revisa oidos y pelaje, especialmente si tu mascota tiene mucho pelo.',
    }
  }

  return {
    icono: 'OK',
    alerta: 'ninguna',
    mensaje: 'Buen dia para un paseo: las condiciones generales son favorables.',
  }
}

export function useClima(ciudad = 'Posadas') {
  const [clima, setClima] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargarClima() {
      try {
        setLoading(true)
        setError('')
        const data = await obtenerClimaActual(ciudad)
        if (active) {
          setClima(data)
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

    cargarClima()

    return () => {
      active = false
    }
  }, [ciudad])

  const consejoMascota = useMemo(() => {
    if (!clima?.ok) return null
    return generarConsejoMascota(clima.temperatura, clima.condicion, clima.humedad)
  }, [clima])

  return { clima, consejoMascota, loading, error }
}
