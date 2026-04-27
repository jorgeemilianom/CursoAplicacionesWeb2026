import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { enviarRecordatorioPorEmail } from '../../ArchivosJS/api/externalApis'
import { obtenerGestaciones } from '../../ArchivosJS/api/gestacionApi'
import { obtenerRecordatoriosPorUsuario } from '../../ArchivosJS/api/recordatoriosApi'
import { obtenerDesparasitaciones, obtenerVacunas } from '../../ArchivosJS/api/vacunasApi'
import { ALERT_PRIORITY_ORDER, STORAGE_KEYS } from '../../ArchivosJS/utils/constants'
import { diasHasta, estaVencida, esMismoDia } from '../../ArchivosJS/utils/fechas'
import { calcularDiasRestantes, generarAlertasGestacion } from '../../ArchivosJS/utils/gestacionUtils'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useUser } from '../../ArchivosJS/hooks/useUser'

// eslint-disable-next-line react-refresh/only-export-components
export const AlertasContext = createContext(null)

function ordenarAlertas(alertas) {
  return alertas.slice().sort((a, b) => {
    const priorityComparison = ALERT_PRIORITY_ORDER[a.prioridad] - ALERT_PRIORITY_ORDER[b.prioridad]
    if (priorityComparison !== 0) return priorityComparison
    return a.fecha.localeCompare(b.fecha)
  })
}

export function AlertasProvider({ children }) {
  const { user } = useUser()
  const { mascotas } = useMascota()
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const chequearVencimientos = useCallback(async (mascotasBase = mascotas) => {
    if (!user) {
      setAlertas([])
      return []
    }

    try {
      setLoading(true)
      setError('')

      const [vacunas, desparasitaciones, gestaciones, recordatorios] = await Promise.all([
        obtenerVacunas(),
        obtenerDesparasitaciones(),
        obtenerGestaciones(),
        obtenerRecordatoriosPorUsuario(user.id),
      ])

      const mascotaIds = new Set(mascotasBase.map((mascota) => mascota.id))
      const mascotasPorId = new Map(mascotasBase.map((mascota) => [mascota.id, mascota]))

      const nuevasAlertas = [
        ...vacunas
          .filter((item) => mascotaIds.has(item.mascotaId))
          .flatMap((item) => {
            const dias = diasHasta(item.proxima)
            const mascotaNombre = mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota'

            if (estaVencida(item.proxima)) {
              return [
                {
                  id: `vacuna-vencida-${item.id}`,
                  tipo: 'vacuna_vencida',
                  prioridad: 'alta',
                  mascotaId: item.mascotaId,
                  mascotaNombre,
                  mensaje: `La vacuna ${item.nombre} de ${mascotaNombre} esta vencida.`,
                  fecha: item.proxima,
                  leida: false,
                  destino: `/vacunas/${item.mascotaId}`,
                },
              ]
            }

            if (dias !== null && dias <= 7) {
              return [
                {
                  id: `vacuna-urgente-${item.id}`,
                  tipo: 'vacuna_proxima',
                  prioridad: 'media',
                  mascotaId: item.mascotaId,
                  mascotaNombre,
                  mensaje: `La vacuna ${item.nombre} de ${mascotaNombre} vence en ${dias} dias.`,
                  fecha: item.proxima,
                  leida: false,
                  destino: `/vacunas/${item.mascotaId}`,
                },
              ]
            }

            if (dias !== null && dias <= 30) {
              return [
                {
                  id: `vacuna-prevencion-${item.id}`,
                  tipo: 'vacuna_proxima',
                  prioridad: 'baja',
                  mascotaId: item.mascotaId,
                  mascotaNombre,
                  mensaje: `La vacuna ${item.nombre} de ${mascotaNombre} vence dentro de 30 dias.`,
                  fecha: item.proxima,
                  leida: false,
                  destino: `/vacunas/${item.mascotaId}`,
                },
              ]
            }

            return []
          }),
        ...desparasitaciones
          .filter((item) => mascotaIds.has(item.mascotaId))
          .filter((item) => {
            const dias = diasHasta(item.proxima)
            return dias !== null && dias >= 0 && dias <= 7
          })
          .map((item) => ({
            id: `desparasitacion-${item.id}`,
            tipo: 'recordatorio',
            prioridad: 'media',
            mascotaId: item.mascotaId,
            mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
            mensaje: `La desparasitacion ${item.producto} esta proxima para ${mascotasPorId.get(item.mascotaId)?.nombre || 'tu mascota'}.`,
            fecha: item.proxima,
            leida: false,
            destino: `/mascotas/${item.mascotaId}`,
          })),
        ...gestaciones
          .filter((item) => mascotaIds.has(item.mascotaId))
          .filter((item) => item.estado === 'en_curso')
          .flatMap((item) => {
            const mascota = mascotasPorId.get(item.mascotaId)
            const mascotaNombre = mascota?.nombre || 'Mascota'
            const diasRestantes = calcularDiasRestantes(item.fechaPartoProbable)

            const baseAlerts = generarAlertasGestacion(item, mascota?.especie).map((alerta) => ({
              ...alerta,
              mascotaId: item.mascotaId,
              mascotaNombre,
              leida: false,
              destino: `/gestacion/${item.mascotaId}`,
              mensaje: `${mascotaNombre}: ${alerta.mensaje}`,
            }))

            if (diasRestantes !== null && diasRestantes <= 7) {
              baseAlerts.unshift({
                id: `gestacion-parto-${item.id}`,
                tipo: 'gestacion',
                prioridad: 'alta',
                mascotaId: item.mascotaId,
                mascotaNombre,
                mensaje: `${mascotaNombre} esta en los ultimos ${Math.max(diasRestantes, 0)} dias antes del parto.`,
                fecha: item.fechaPartoProbable,
                leida: false,
                destino: `/gestacion/${item.mascotaId}`,
              })
            }

            return baseAlerts
          }),
        ...recordatorios
          .filter((item) => mascotaIds.has(item.mascotaId))
          .filter((item) => !item.notificado && esMismoDia(item.fecha, new Date()))
          .map((item) => ({
            id: `recordatorio-${item.id}`,
            tipo: 'recordatorio',
            prioridad: 'alta',
            mascotaId: item.mascotaId,
            mascotaNombre: mascotasPorId.get(item.mascotaId)?.nombre || 'Mascota',
            mensaje: `Tienes pendiente hoy: ${item.titulo}.`,
            fecha: item.fecha,
            leida: false,
            destino: '/calendario',
          })),
      ]

      const ordenadas = ordenarAlertas(nuevasAlertas)
      setAlertas(ordenadas)
      return ordenadas
    } catch (err) {
      setError(err.message)
      setAlertas([])
      return []
    } finally {
      setLoading(false)
    }
  }, [mascotas, user])

  useEffect(() => {
    chequearVencimientos()
  }, [chequearVencimientos])

  useEffect(() => {
    async function notificarPorEmail() {
      if (!user?.email) return

      const enabled = localStorage.getItem(STORAGE_KEYS.emailNotifications) === 'true'
      if (!enabled) return

      const enviados = JSON.parse(localStorage.getItem('petbook_email_alertas_enviadas') || '[]')
      const pendientes = alertas.filter(
        (alerta) =>
          ['vacuna_vencida', 'vacuna_proxima', 'recordatorio', 'gestacion'].includes(alerta.tipo) &&
          !enviados.includes(alerta.id),
      )

      for (const alerta of pendientes) {
        const resultado = await enviarRecordatorioPorEmail({
          emailDestino: user.email,
          nombreDuenio: user.nombre,
          nombreMascota: alerta.mascotaNombre,
          tipoEvento: alerta.tipo,
          fechaEvento: alerta.fecha,
          descripcion: alerta.mensaje,
        })

        if (resultado?.status === 200 || resultado?.ok === false) {
          enviados.push(alerta.id)
        }
      }

      localStorage.setItem('petbook_email_alertas_enviadas', JSON.stringify(enviados))
    }

    notificarPorEmail()
  }, [alertas, user?.email, user?.nombre])

  function agregarAlerta(alerta) {
    setAlertas((prev) => ordenarAlertas([{ leida: false, ...alerta }, ...prev]))
  }

  function marcarLeida(id) {
    setAlertas((prev) => prev.map((alerta) => (alerta.id === id ? { ...alerta, leida: true } : alerta)))
  }

  function marcarTodasLeidas() {
    setAlertas((prev) => prev.map((alerta) => ({ ...alerta, leida: true })))
  }

  function descartarAlerta(id) {
    setAlertas((prev) => prev.filter((alerta) => alerta.id !== id))
  }

  function limpiarAlertas() {
    setAlertas([])
  }

  const alertasNoLeidas = useMemo(() => alertas.filter((alerta) => !alerta.leida), [alertas])
  const cantidadNoLeidas = alertasNoLeidas.length
  const alertasAltas = useMemo(() => alertas.filter((alerta) => alerta.prioridad === 'alta'), [alertas])

  const value = {
    alertas,
    alertasNoLeidas,
    cantidadNoLeidas,
    alertasAltas,
    loading,
    error,
    agregarAlerta,
    marcarLeida,
    marcarTodasLeidas,
    descartarAlerta,
    limpiarAlertas,
    chequearVencimientos,
  }

  return <AlertasContext.Provider value={value}>{children}</AlertasContext.Provider>
}
