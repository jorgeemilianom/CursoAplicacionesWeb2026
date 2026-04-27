import { useEffect, useMemo, useState } from 'react'
import {
  actualizarDesparasitacion,
  actualizarVacuna,
  crearDesparasitacion,
  crearVacuna,
  eliminarDesparasitacionApi,
  eliminarVacunaApi,
  obtenerDesparasitacionesPorMascota,
  obtenerVacunas,
  obtenerVacunasPorMascota,
} from '../api/vacunasApi'
import { diasHasta, estaVencida, venceProximamente } from '../utils/fechas'

export function useVacunas(mascotaId) {
  const [vacunas, setVacunas] = useState([])
  const [desparasitaciones, setDesparasitaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargar() {
      try {
        setLoading(true)
        setError('')
        const vacunasData = mascotaId ? await obtenerVacunasPorMascota(mascotaId) : await obtenerVacunas()
        const desparasitacionesData = mascotaId ? await obtenerDesparasitacionesPorMascota(mascotaId) : []

        if (active) {
          setVacunas(
            vacunasData.map((vacuna) => ({
              ...vacuna,
              vencida: estaVencida(vacuna.proxima),
              diasRestantes: diasHasta(vacuna.proxima),
            })),
          )
          setDesparasitaciones(
            desparasitacionesData.map((item) => ({
              ...item,
              vencida: estaVencida(item.proxima),
              diasRestantes: diasHasta(item.proxima),
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

  const vacunasVencidas = useMemo(() => vacunas.filter((vacuna) => vacuna.vencida), [vacunas])
  const vacunasPorVencer = useMemo(
    () => vacunas.filter((vacuna) => !vacuna.vencida && venceProximamente(vacuna.proxima)),
    [vacunas],
  )

  const estadoGeneral = useMemo(() => {
    if (vacunasVencidas.length > 0) return 'vencido'
    if (vacunasPorVencer.length > 0) return 'atencion'
    return 'al_dia'
  }, [vacunasPorVencer.length, vacunasVencidas.length])

  async function agregarVacuna(datos) {
    const nuevaVacuna = await crearVacuna({
      ...datos,
      mascotaId: Number(mascotaId),
    })

    setVacunas((prev) => [
      {
        ...nuevaVacuna,
        vencida: estaVencida(nuevaVacuna.proxima),
        diasRestantes: diasHasta(nuevaVacuna.proxima),
      },
      ...prev,
    ])

    return nuevaVacuna
  }

  async function editarVacuna(id, datos) {
    const actualizada = await actualizarVacuna(id, datos)
    setVacunas((prev) =>
      prev.map((vacuna) =>
        vacuna.id === Number(id)
          ? {
              ...actualizada,
              vencida: estaVencida(actualizada.proxima),
              diasRestantes: diasHasta(actualizada.proxima),
            }
          : vacuna,
      ),
    )
    return actualizada
  }

  async function eliminarVacuna(id) {
    await eliminarVacunaApi(id)
    setVacunas((prev) => prev.filter((vacuna) => vacuna.id !== Number(id)))
  }

  async function agregarDesparasitacion(datos) {
    const nueva = await crearDesparasitacion({
      ...datos,
      mascotaId: Number(mascotaId),
    })

    setDesparasitaciones((prev) => [
      {
        ...nueva,
        vencida: estaVencida(nueva.proxima),
        diasRestantes: diasHasta(nueva.proxima),
      },
      ...prev,
    ])

    return nueva
  }

  async function editarDesparasitacion(id, datos) {
    const actualizada = await actualizarDesparasitacion(id, datos)
    setDesparasitaciones((prev) =>
      prev.map((item) =>
        item.id === Number(id)
          ? {
              ...actualizada,
              vencida: estaVencida(actualizada.proxima),
              diasRestantes: diasHasta(actualizada.proxima),
            }
          : item,
      ),
    )
    return actualizada
  }

  async function eliminarDesparasitacion(id) {
    await eliminarDesparasitacionApi(id)
    setDesparasitaciones((prev) => prev.filter((item) => item.id !== Number(id)))
  }

  return {
    vacunas,
    desparasitaciones,
    loading,
    error,
    vacunasVencidas,
    vacunasPorVencer,
    estadoGeneral,
    agregarVacuna,
    editarVacuna,
    eliminarVacuna,
    agregarDesparasitacion,
    editarDesparasitacion,
    eliminarDesparasitacion,
  }
}
