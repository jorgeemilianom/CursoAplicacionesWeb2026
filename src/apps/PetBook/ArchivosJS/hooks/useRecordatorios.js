import { useEffect, useMemo, useState } from 'react'
import {
  crearRecordatorioApi,
  editarRecordatorioApi,
  eliminarRecordatorioApi,
  marcarRecordatorioCompletadoApi,
  obtenerRecordatoriosPorMascota,
  obtenerRecordatoriosPorUsuario,
} from '../api/recordatoriosApi'
import { diasHasta, esMismoDia } from '../utils/fechas'
import { useUser } from './useUser'

export function useRecordatorios(mascotaId = null) {
  const { user } = useUser()
  const [recordatorios, setRecordatorios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargarRecordatorios() {
      if (!user) {
        setRecordatorios([])
        return
      }

      try {
        setLoading(true)
        setError('')

        const data = mascotaId
          ? await obtenerRecordatoriosPorMascota(mascotaId)
          : await obtenerRecordatoriosPorUsuario(user.id)

        if (!active) return

        setRecordatorios(data)
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

    cargarRecordatorios()

    return () => {
      active = false
    }
  }, [mascotaId, user])

  const recordatoriosHoy = useMemo(
    () => recordatorios.filter((recordatorio) => esMismoDia(recordatorio.fecha, new Date())),
    [recordatorios],
  )

  const recordatoriosProximos = useMemo(
    () =>
      recordatorios.filter((recordatorio) => {
        const dias = diasHasta(recordatorio.fecha)
        return dias !== null && dias >= 0 && dias <= 7
      }),
    [recordatorios],
  )

  const recordatoriosPasados = useMemo(
    () =>
      recordatorios.filter((recordatorio) => {
        const dias = diasHasta(recordatorio.fecha)
        return dias !== null && dias < 0 && !recordatorio.notificado
      }),
    [recordatorios],
  )

  async function crearRecordatorio(datos) {
    if (!user) throw new Error('Necesitas iniciar sesion para crear recordatorios.')

    const nuevo = await crearRecordatorioApi({
      usuarioId: user.id,
      notificado: false,
      repetir: 'no',
      ...datos,
      mascotaId: Number(datos.mascotaId),
    })

    setRecordatorios((prev) => [...prev, nuevo].sort((a, b) => a.fecha.localeCompare(b.fecha)))
    return nuevo
  }

  async function editarRecordatorio(id, datos) {
    const actualizado = await editarRecordatorioApi(id, {
      ...datos,
      mascotaId: Number(datos.mascotaId),
    })
    setRecordatorios((prev) => prev.map((item) => (item.id === Number(id) ? actualizado : item)))
    return actualizado
  }

  async function eliminarRecordatorio(id) {
    await eliminarRecordatorioApi(id)
    setRecordatorios((prev) => prev.filter((item) => item.id !== Number(id)))
  }

  async function marcarCompletado(id) {
    const actual = recordatorios.find((item) => item.id === Number(id))
    const actualizado = await marcarRecordatorioCompletadoApi(id, {
      ...(actual || {}),
      notificado: true,
      completado: true,
    })
    setRecordatorios((prev) => prev.map((item) => (item.id === Number(id) ? actualizado : item)))
    return actualizado
  }

  return {
    recordatorios,
    recordatoriosHoy,
    recordatoriosProximos,
    recordatoriosPasados,
    loading,
    error,
    crearRecordatorio,
    editarRecordatorio,
    eliminarRecordatorio,
    marcarCompletado,
  }
}
