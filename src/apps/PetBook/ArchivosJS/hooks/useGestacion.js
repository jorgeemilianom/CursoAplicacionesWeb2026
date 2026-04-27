import { useEffect, useMemo, useState } from 'react'
import { addDays } from 'date-fns'
import { crearMascota } from '../api/mascotasApi'
import {
  actualizarCriaApi,
  actualizarGestacionApi,
  crearCriaApi,
  crearGestacionApi,
  obtenerCriasPorGestacion,
  obtenerGestacionesPorMascota,
  patchGestacionApi,
} from '../api/gestacionApi'
import { crearRecordatorioApi } from '../api/recordatoriosApi'
import { useMascota } from './useMascota'
import { useUser } from './useUser'
import {
  calcularDiaActual,
  calcularDiasRestantes,
  calcularFechaParto,
  calcularProgreso,
  calcularSemanaActual,
  generarAlertasGestacion,
  obtenerHitoActual,
  obtenerHitosGestacion,
  obtenerHitosProximos,
} from '../utils/gestacionUtils'

function sortGestaciones(items) {
  return items.slice().sort((a, b) => b.fechaCruce.localeCompare(a.fechaCruce))
}

export function useGestacion(mascotaId) {
  const { user } = useUser()
  const { mascota, actualizarMascota } = useMascota(mascotaId)
  const [gestacion, setGestacion] = useState(null)
  const [historial, setHistorial] = useState([])
  const [crias, setCrias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function cargarGestacion() {
      if (!mascotaId) return

      try {
        setLoading(true)
        setError('')

        const gestacionesData = await obtenerGestacionesPorMascota(mascotaId)
        if (!active) return

        const ordered = sortGestaciones(gestacionesData)
        const activa = ordered.find((item) => item.estado === 'en_curso')
        const principal = activa || ordered[0] || null

        setHistorial(ordered)
        setGestacion(principal)

        if (principal) {
          const criasData = await obtenerCriasPorGestacion(principal.id)
          if (active) {
            setCrias(criasData)
          }
        } else if (active) {
          setCrias([])
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

    cargarGestacion()

    return () => {
      active = false
    }
  }, [mascotaId])

  const especie = mascota?.especie || 'otro'
  const semanaActual = useMemo(() => calcularSemanaActual(gestacion?.fechaCruce), [gestacion?.fechaCruce])
  const diaActual = useMemo(() => calcularDiaActual(gestacion?.fechaCruce), [gestacion?.fechaCruce])
  const progreso = useMemo(() => calcularProgreso(gestacion?.fechaCruce, especie), [especie, gestacion?.fechaCruce])
  const diasRestantes = useMemo(() => calcularDiasRestantes(gestacion?.fechaPartoProbable), [gestacion?.fechaPartoProbable])
  const hitoActual = useMemo(() => obtenerHitoActual(gestacion?.fechaCruce, especie), [especie, gestacion?.fechaCruce])
  const hitosProximos = useMemo(() => obtenerHitosProximos(gestacion?.fechaCruce, especie), [especie, gestacion?.fechaCruce])
  const timeline = useMemo(() => {
    if (!gestacion) return []

    return obtenerHitosGestacion(gestacion, especie).map((hito) => {
      if (hito.dia < diaActual) return { ...hito, estado: 'completado' }
      if (hito.dia === hitoActual?.dia) return { ...hito, estado: 'actual' }
      return { ...hito, estado: 'futuro' }
    })
  }, [diaActual, especie, gestacion, hitoActual?.dia])

  const alertasGestacion = useMemo(() => generarAlertasGestacion(gestacion, especie), [especie, gestacion])
  const tieneGestacion = Boolean(gestacion && gestacion.estado === 'en_curso')
  const esHembra = mascota?.sexo === 'hembra'

  async function crearRecordatoriosDeGestacion(baseGestacion) {
    if (!user || !mascota) return

    const hitos = obtenerHitosGestacion(baseGestacion, especie)
    await Promise.all(
      hitos.map((hito) =>
        crearRecordatorioApi({
          mascotaId: mascota.id,
          usuarioId: user.id,
          titulo: `[GESTACION] ${hito.titulo} - ${mascota.nombre}`,
          fecha: hito.fecha,
          tipo: 'gestacion',
          notificado: false,
          repetir: 'no',
          notas: hito.descripcion,
        }),
      ),
    )
  }

  async function iniciarGestacion(datos) {
    if (!mascota || !user) throw new Error('Necesitas una mascota valida para iniciar la gestacion.')
    if (mascota.sexo !== 'hembra') throw new Error('El modulo de gestacion solo esta habilitado para hembras.')

    const nuevaGestacion = await crearGestacionApi({
      mascotaId: mascota.id,
      fechaCruce: datos.fechaCruce,
      fechaPartoProbable: calcularFechaParto(datos.fechaCruce, especie),
      tipoCruce: datos.tipoCruce,
      machoReproductor: datos.machoReproductor || '',
      cantidadCriasEsperadas: Number(datos.cantidadCriasEsperadas || 0),
      veterinarioSeguimiento: datos.veterinarioSeguimiento || '',
      estado: 'en_curso',
      notas: datos.notas || '',
      fechaPartoReal: '',
      tipoParto: '',
    })

    await crearRecordatoriosDeGestacion(nuevaGestacion)

    setGestacion(nuevaGestacion)
    setHistorial((prev) => sortGestaciones([nuevaGestacion, ...prev]))
    setCrias([])
    return nuevaGestacion
  }

  async function registrarParto(datos) {
    if (!gestacion) throw new Error('No hay gestacion activa para registrar el parto.')

    const actualizada = await actualizarGestacionApi(gestacion.id, {
      ...gestacion,
      estado: 'finalizada',
      fechaPartoReal: datos.fechaPartoReal,
      horaParto: datos.horaParto || '',
      tipoParto: datos.tipoParto,
      cantidadCriasNacidas: Number(datos.cantidadCriasNacidas || 0),
      cantidadCriasVivas: Number(datos.cantidadCriasVivas || 0),
      cantidadCriasSinVida: Number(datos.cantidadCriasSinVida || 0),
      pesoPromedioCrias: Number(datos.pesoPromedioCrias || 0),
      complicaciones: datos.complicaciones || '',
      veterinarioPresente: datos.veterinarioPresente || '',
      notas: datos.notasGenerales || gestacion.notas || '',
    })

    const criasCreadas = await Promise.all(
      (datos.crias || []).map((cria, index) =>
        crearCriaApi({
          gestacionId: gestacion.id,
          mascotaMadreId: mascota.id,
          numero: index + 1,
          nombre: cria.nombre || `Cria #${index + 1}`,
          sexo: cria.sexo || 'no determinado',
          color: cria.color || '',
          pesoNacimiento: Number(cria.pesoNacimiento || 0),
          fechaNacimiento: datos.fechaPartoReal,
          estado: cria.estado || 'vivo',
          mascotaId: null,
          observaciones: cria.observaciones || '',
        }),
      ),
    )

    if (user) {
      const fechaDestete = addDays(new Date(datos.fechaPartoReal), 60).toISOString().slice(0, 10)
      await crearRecordatorioApi({
        mascotaId: mascota.id,
        usuarioId: user.id,
        titulo: `[CAMADA] Destete sugerido - ${mascota.nombre}`,
        fecha: fechaDestete,
        tipo: 'gestacion',
        notificado: false,
        repetir: 'no',
        notas: 'Seguimiento post-parto para la camada.',
      })

      await Promise.all(
        criasCreadas.map((cria) =>
          crearRecordatorioApi({
            mascotaId: mascota.id,
            usuarioId: user.id,
            titulo: `[CAMADA] Primera vacuna ${cria.nombre}`,
            fecha: fechaDestete,
            tipo: 'vacuna',
            notificado: false,
            repetir: 'no',
            notas: 'Control inicial y primera vacuna de la cria.',
          }),
        ),
      )
    }

    setGestacion(actualizada)
    setHistorial((prev) => prev.map((item) => (item.id === actualizada.id ? actualizada : item)))
    setCrias(criasCreadas)
    return actualizada
  }

  async function actualizarNotas(notas) {
    if (!gestacion) return null
    const actualizada = await patchGestacionApi(gestacion.id, { notas })
    setGestacion((prev) => ({ ...prev, ...actualizada }))
    setHistorial((prev) => prev.map((item) => (item.id === actualizada.id ? { ...item, ...actualizada } : item)))
    return actualizada
  }

  async function editarDatosGestacion(datos) {
    if (!gestacion) return null

    const actualizada = await actualizarGestacionApi(gestacion.id, {
      ...gestacion,
      ...datos,
      cantidadCriasEsperadas: Number(datos.cantidadCriasEsperadas || 0),
      fechaPartoProbable: datos.fechaCruce ? calcularFechaParto(datos.fechaCruce, especie) : gestacion.fechaPartoProbable,
    })

    setGestacion(actualizada)
    setHistorial((prev) => prev.map((item) => (item.id === actualizada.id ? actualizada : item)))
    return actualizada
  }

  async function cancelarGestacion(motivo) {
    if (!gestacion) return null

    const actualizada = await patchGestacionApi(gestacion.id, {
      estado: 'cancelada',
      motivoCancelacion: motivo || '',
    })

    setGestacion((prev) => ({ ...prev, ...actualizada }))
    setHistorial((prev) => prev.map((item) => (item.id === gestacion.id ? { ...item, ...actualizada } : item)))
    return actualizada
  }

  async function crearFichaCria(criaId) {
    const cria = crias.find((item) => item.id === Number(criaId))
    if (!cria || !user) throw new Error('No fue posible encontrar la cria seleccionada.')
    if (cria.mascotaId) throw new Error('Esta cria ya tiene una ficha creada.')

    const nuevaMascota = await crearMascota({
      usuarioId: user.id,
      nombre: cria.nombre,
      especie,
      raza: mascota?.raza || '',
      sexo: cria.sexo === 'no determinado' ? 'hembra' : cria.sexo,
      fechaNacimiento: cria.fechaNacimiento,
      color: cria.color || '',
      peso: Number((cria.pesoNacimiento || 0) / 1000),
      foto: '',
      veterinario: mascota?.veterinario || '',
      telefonoVet: mascota?.telefonoVet || '',
      microchip: '',
      esterilizado: false,
      activo: true,
      contactoEmergencia: '',
    })

    const criaActualizada = await actualizarCriaApi(cria.id, {
      ...cria,
      mascotaId: nuevaMascota.id,
    })

    setCrias((prev) => prev.map((item) => (item.id === cria.id ? criaActualizada : item)))
    return nuevaMascota
  }

  async function marcarCriaAdoptada(criaId) {
    const cria = crias.find((item) => item.id === Number(criaId))
    if (!cria) return null

    const actualizada = await actualizarCriaApi(cria.id, {
      ...cria,
      estado: 'adoptada',
    })
    setCrias((prev) => prev.map((item) => (item.id === cria.id ? actualizada : item)))
    return actualizada
  }

  async function actualizarCria(criaId, datos) {
    const cria = crias.find((item) => item.id === Number(criaId))
    if (!cria) return null

    const actualizada = await actualizarCriaApi(cria.id, {
      ...cria,
      ...datos,
      pesoNacimiento: Number(datos.pesoNacimiento ?? cria.pesoNacimiento ?? 0),
    })
    setCrias((prev) => prev.map((item) => (item.id === cria.id ? actualizada : item)))
    return actualizada
  }

  return {
    mascota,
    gestacion,
    historial,
    crias,
    tieneGestacion,
    esHembra,
    loading,
    error,
    semanaActual,
    diaActual,
    progreso,
    diasRestantes,
    hitoActual,
    hitosProximos,
    timeline,
    alertasGestacion,
    actualizarMascota,
    iniciarGestacion,
    registrarParto,
    actualizarNotas,
    editarDatosGestacion,
    cancelarGestacion,
    crearFichaCria,
    marcarCriaAdoptada,
    actualizarCria,
  }
}
