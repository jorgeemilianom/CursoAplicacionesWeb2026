import { useContext, useEffect, useMemo, useState } from 'react'
import {
  crearConsulta,
  crearNotaSalud,
  eliminarConsultaApi,
  eliminarNotaSaludApi,
  obtenerConsultasPorMascota,
  obtenerNotasSaludPorMascota,
  actualizarConsulta,
} from '../api/consultasApi'
import { obtenerMascotaPorId } from '../api/mascotasApi'
import { calcularEdad, formatearFechaCorta } from '../utils/fechas'
import { MascotaContext } from '../../ArchivosJSX/context/MascotaContext'

export function useMascota(mascotaId) {
  const context = useContext(MascotaContext)
  const [mascota, setMascota] = useState(null)
  const [consultas, setConsultas] = useState([])
  const [notasSalud, setNotasSalud] = useState([])
  const [loadingDetalle, setLoadingDetalle] = useState(false)
  const [errorDetalle, setErrorDetalle] = useState('')

  useEffect(() => {
    let active = true

    async function cargarDetalle() {
      if (!mascotaId) return

      try {
        setLoadingDetalle(true)
        setErrorDetalle('')

        const [mascotaData, consultasData, notasData] = await Promise.all([
          obtenerMascotaPorId(mascotaId),
          obtenerConsultasPorMascota(mascotaId),
          obtenerNotasSaludPorMascota(mascotaId),
        ])

        if (!active) return

        setMascota(mascotaData)
        setConsultas(consultasData)
        setNotasSalud(notasData)
      } catch (err) {
        if (active) {
          setErrorDetalle(err.message)
        }
      } finally {
        if (active) {
          setLoadingDetalle(false)
        }
      }
    }

    cargarDetalle()

    return () => {
      active = false
    }
  }, [mascotaId])

  const edadCalculada = useMemo(() => calcularEdad(mascota?.fechaNacimiento), [mascota?.fechaNacimiento])
  const pesoHistorial = useMemo(
    () =>
      consultas
        .filter((consulta) => consulta.peso)
        .slice()
        .reverse()
        .map((consulta) => ({
          fecha: formatearFechaCorta(consulta.fecha),
          peso: Number(consulta.peso),
        })),
    [consultas],
  )

  async function actualizarMascotaDetalle(id, datos) {
    const actualizada = await context.actualizarMascota(id, datos)
    setMascota(actualizada)
    return actualizada
  }

  async function eliminarMascotaDetalle(id) {
    await context.eliminarMascota(id)
    setMascota(null)
  }

  async function agregarConsulta(datos) {
    const nueva = await crearConsulta({
      ...datos,
      mascotaId: Number(mascotaId),
    })
    setConsultas((prev) => [nueva, ...prev])
    return nueva
  }

  async function editarConsulta(id, datos) {
    const actualizada = await actualizarConsulta(id, datos)
    setConsultas((prev) => prev.map((consulta) => (consulta.id === Number(id) ? actualizada : consulta)))
    return actualizada
  }

  async function eliminarConsulta(id) {
    await eliminarConsultaApi(id)
    setConsultas((prev) => prev.filter((consulta) => consulta.id !== Number(id)))
  }

  async function agregarNota(datos) {
    const nueva = await crearNotaSalud({
      ...datos,
      mascotaId: Number(mascotaId),
    })
    setNotasSalud((prev) => [nueva, ...prev])
    return nueva
  }

  async function eliminarNota(id) {
    await eliminarNotaSaludApi(id)
    setNotasSalud((prev) => prev.filter((nota) => nota.id !== Number(id)))
  }

  if (!mascotaId) {
    return context
  }

  return {
    ...context,
    mascota,
    consultas,
    notasSalud,
    loading: context.loading || loadingDetalle,
    error: context.error || errorDetalle,
    edadCalculada,
    pesoHistorial,
    actualizarMascota: actualizarMascotaDetalle,
    eliminarMascota: eliminarMascotaDetalle,
    agregarConsulta,
    editarConsulta,
    eliminarConsulta,
    agregarNota,
    eliminarNota,
  }
}
