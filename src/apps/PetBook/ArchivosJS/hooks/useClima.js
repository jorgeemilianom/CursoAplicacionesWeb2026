import { useEffect, useState } from 'react'
import { obtenerClimaActual } from '../api/externalApis'

export function useClima() {
  const [clima, setClima] = useState(null)

  useEffect(() => {
    obtenerClimaActual().then(setClima)
  }, [])

  return clima
}
