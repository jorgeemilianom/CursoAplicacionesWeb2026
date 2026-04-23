import { useEffect, useState } from 'react'
import { obtenerVeterinariasCercanas } from '../api/externalApis'

export function useVeterinarias() {
  const [veterinarias, setVeterinarias] = useState([])

  useEffect(() => {
    obtenerVeterinariasCercanas().then(setVeterinarias)
  }, [])

  return veterinarias
}
