import { createContext, useEffect, useState } from 'react'
import { obtenerGestaciones } from '../../ArchivosJS/api/gestacionApi'
import { obtenerVacunas } from '../../ArchivosJS/api/vacunasApi'
import { diasHasta, estaVencida } from '../../ArchivosJS/utils/fechas'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useUser } from '../../ArchivosJS/hooks/useUser'

// eslint-disable-next-line react-refresh/only-export-components
export const AlertasContext = createContext(null)

export function AlertasProvider({ children }) {
  const { user } = useUser()
  const { mascotas } = useMascota()
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function revisarAlertas() {
      if (!user) {
        setAlertas([])
        return
      }

      try {
        setLoading(true)
        const [vacunas, gestaciones] = await Promise.all([obtenerVacunas(), obtenerGestaciones()])

        if (!active) return

        const mascotaIds = new Set(mascotas.map((mascota) => mascota.id))

        const alertasVacunas = vacunas
          .filter((vacuna) => mascotaIds.has(vacuna.mascotaId))
          .filter((vacuna) => {
            const dias = diasHasta(vacuna.proxima)
            return estaVencida(vacuna.proxima) || (dias !== null && dias <= 15)
          })
          .map((vacuna) => ({
            id: `vacuna-${vacuna.id}`,
            tipo: 'vacuna',
            titulo: `${vacuna.nombre} requiere seguimiento`,
            detalle: estaVencida(vacuna.proxima)
              ? 'La vacuna ya vencio.'
              : `Faltan ${diasHasta(vacuna.proxima)} dias para la proxima dosis.`,
            leida: false,
          }))

        const alertasGestacion = gestaciones
          .filter((gestacion) => mascotaIds.has(gestacion.mascotaId))
          .filter((gestacion) => {
            const dias = diasHasta(gestacion.fechaPartoProbable)
            return dias !== null && dias <= 14
          })
          .map((gestacion) => ({
            id: `gestacion-${gestacion.id}`,
            tipo: 'gestacion',
            titulo: 'Seguimiento de gestacion activo',
            detalle: `Faltan ${Math.max(0, diasHasta(gestacion.fechaPartoProbable))} dias para la fecha probable de parto.`,
            leida: false,
          }))

        setAlertas([...alertasVacunas, ...alertasGestacion])
      } catch {
        if (active) {
          setAlertas([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    revisarAlertas()

    return () => {
      active = false
    }
  }, [user, mascotas])

  function agregarAlerta(alerta) {
    setAlertas((prev) => [alerta, ...prev])
  }

  function marcarLeida(id) {
    setAlertas((prev) => prev.map((alerta) => (alerta.id === id ? { ...alerta, leida: true } : alerta)))
  }

  function limpiarAlertas() {
    setAlertas([])
  }

  const value = {
    alertas,
    loading,
    agregarAlerta,
    marcarLeida,
    limpiarAlertas,
  }

  return <AlertasContext.Provider value={value}>{children}</AlertasContext.Provider>
}
