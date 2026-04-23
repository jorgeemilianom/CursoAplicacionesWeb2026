import { useEffect, useMemo, useState } from 'react'
import { obtenerConsultas } from '../api/consultasApi'
import { obtenerGestaciones } from '../api/gestacionApi'
import { obtenerRecordatoriosPorUsuario } from '../api/recordatoriosApi'
import { obtenerDesparasitaciones, obtenerVacunas } from '../api/vacunasApi'
import { EVENT_TYPE_META } from '../utils/constants'
import { diasHasta, esMismoDia } from '../utils/fechas'
import { obtenerHitosGestacion } from '../utils/gestacionUtils'
import { useMascota } from './useMascota'
import { useUser } from './useUser'

function sortByDate(items) {
  return items.slice().sort((a, b) => {
    const dateComparison = a.fecha.localeCompare(b.fecha)
    if (dateComparison !== 0) return dateComparison
    return a.titulo.localeCompare(b.titulo)
  })
}

export function useCalendarioEventos() {
  const { user } = useUser()
  const { mascotas } = useMascota()
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)

  useEffect(() => {
    let active = true

    async function cargarEventos() {
      if (!user) {
        setEventos([])
        return
      }

      try {
        setLoading(true)
        setError('')

        const [vacunas, desparasitaciones, gestaciones, recordatorios, consultas] = await Promise.all([
          obtenerVacunas(),
          obtenerDesparasitaciones(),
          obtenerGestaciones(),
          obtenerRecordatoriosPorUsuario(user.id),
          obtenerConsultas(),
        ])

        if (!active) return

        const mascotasPorId = new Map(mascotas.map((mascota) => [mascota.id, mascota]))
        const mascotaIds = new Set(mascotas.map((mascota) => mascota.id))

        const eventosUnificados = [
          ...vacunas
            .filter((item) => mascotaIds.has(item.mascotaId))
            .map((item) => {
              const overdue = (diasHasta(item.proxima) ?? 0) < 0
              return {
                id: `vac-${item.id}`,
                refId: item.id,
                fecha: item.proxima,
                titulo: `${item.nombre} - ${mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota'}`,
                descripcion: overdue ? 'Vacuna vencida' : `Proxima dosis de ${item.nombre}`,
                tipo: overdue ? 'vencido' : 'vacuna',
                mascotaId: item.mascotaId,
                mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
                completado: false,
                origen: 'vacunas',
              }
            }),
          ...desparasitaciones
            .filter((item) => mascotaIds.has(item.mascotaId))
            .map((item) => ({
              id: `desp-${item.id}`,
              refId: item.id,
              fecha: item.proxima,
              titulo: `${item.producto} - ${mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota'}`,
              descripcion: `Desparasitacion ${item.tipo}`,
              tipo: (diasHasta(item.proxima) ?? 0) < 0 ? 'vencido' : 'desparasitacion',
              mascotaId: item.mascotaId,
              mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
              completado: false,
              origen: 'desparasitaciones',
            })),
          ...gestaciones
            .filter((item) => mascotaIds.has(item.mascotaId))
            .flatMap((item) =>
              obtenerHitosGestacion(item).map((hito) => ({
                id: `gest-${hito.id}`,
                refId: item.id,
                fecha: hito.fecha,
                titulo: `${hito.titulo} - ${mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota'}`,
                descripcion: hito.descripcion,
                tipo: 'gestacion',
                mascotaId: item.mascotaId,
                mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
                completado: false,
                origen: 'gestaciones',
              })),
            ),
          ...recordatorios
            .filter((item) => mascotaIds.has(item.mascotaId))
            .map((item) => ({
              id: `rec-${item.id}`,
              refId: item.id,
              fecha: item.fecha,
              titulo: item.titulo,
              descripcion: item.notas || EVENT_TYPE_META.recordatorio.label,
              tipo: 'recordatorio',
              mascotaId: item.mascotaId,
              mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
              completado: Boolean(item.completado || item.notificado),
              origen: 'recordatorios',
            })),
          ...consultas
            .filter((item) => mascotaIds.has(item.mascotaId))
            .filter((item) => (diasHasta(item.fecha) ?? -1) >= 0)
            .map((item) => ({
              id: `con-${item.id}`,
              refId: item.id,
              fecha: item.fecha,
              titulo: `${item.motivo} - ${mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota'}`,
              descripcion: item.veterinario ? `Consulta con ${item.veterinario}` : 'Consulta veterinaria programada',
              tipo: 'consulta',
              mascotaId: item.mascotaId,
              mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
              completado: false,
              origen: 'consultas',
            })),
        ]

        setEventos(sortByDate(eventosUnificados))
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

    cargarEventos()

    return () => {
      active = false
    }
  }, [mascotas, refreshIndex, user])

  const proximosEventos = useMemo(
    () =>
      eventos.filter((evento) => {
        const dias = diasHasta(evento.fecha)
        return dias !== null && dias >= 0 && dias <= 7
      }),
    [eventos],
  )

  function obtenerEventosDeFecha(fecha) {
    return eventos.filter((evento) => esMismoDia(evento.fecha, fecha))
  }

  function recargarEventos() {
    setRefreshIndex((prev) => prev + 1)
  }

  return {
    eventos,
    proximosEventos,
    loading,
    error,
    obtenerEventosDeFecha,
    recargarEventos,
  }
}
