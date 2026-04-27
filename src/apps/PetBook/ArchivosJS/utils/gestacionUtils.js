import { addDays, differenceInCalendarDays, parseISO } from 'date-fns'

export const PERIODOS_GESTACION = {
  perro: 63,
  gato: 65,
  conejo: 31,
  hamster: 16,
  cobayo: 68,
  vaca: 283,
  oveja: 147,
  cabra: 150,
  cerdo: 114,
  otro: 63,
}

export const HITOS_GESTACION = {
  perro: [
    { dia: 7, titulo: 'Fecundacion', descripcion: 'Los espermatozoides fecundan los ovulos.' },
    { dia: 14, titulo: 'Implantacion embrionaria', descripcion: 'Los embriones se implantan en el utero.' },
    { dia: 21, titulo: 'Primera ecografia', descripcion: 'Ya es posible detectar actividad cardiaca.' },
    { dia: 28, titulo: 'Ecografia recomendada', descripcion: 'Confirmar cantidad de cachorros.' },
    { dia: 35, titulo: 'Cambios fisicos visibles', descripcion: 'El abdomen comienza a crecer notoriamente.' },
    { dia: 42, titulo: 'Radiografia opcional', descripcion: 'Contar esqueletos para saber cantidad exacta.' },
    { dia: 49, titulo: 'Preparar espacio de parto', descripcion: 'Instalar caja de parto en lugar tranquilo.' },
    { dia: 56, titulo: 'Monitoreo de temperatura', descripcion: 'Tomar temperatura rectal dos veces al dia.' },
    { dia: 60, titulo: 'Parto inminente', descripcion: 'Atencion permanente. Preparar todo para el parto.' },
    { dia: 63, titulo: 'Fecha probable de parto', descripcion: 'El parto puede ocurrir entre el dia 58 y 68.' },
  ],
  gato: [
    { dia: 14, titulo: 'Implantacion embrionaria', descripcion: 'Los embriones se implantan en el utero.' },
    { dia: 21, titulo: 'Primera ecografia', descripcion: 'Se puede detectar actividad cardiaca fetal.' },
    { dia: 30, titulo: 'Ecografia confirmatoria', descripcion: 'Confirmar cantidad de gatitos.' },
    { dia: 35, titulo: 'Abdomen visible', descripcion: 'Crecimiento abdominal notorio.' },
    { dia: 45, titulo: 'Preparar espacio', descripcion: 'La gata buscara un lugar tranquilo para parir.' },
    { dia: 58, titulo: 'Parto inminente', descripcion: 'Atencion permanente requerida.' },
    { dia: 65, titulo: 'Fecha probable de parto', descripcion: 'El parto puede ocurrir entre el dia 60 y 70.' },
  ],
}

function parseDate(fecha) {
  return typeof fecha === 'string' ? parseISO(fecha) : fecha
}

function getPeriodo(especie) {
  return PERIODOS_GESTACION[especie] || PERIODOS_GESTACION.otro
}

function getHitos(especie) {
  return HITOS_GESTACION[especie] || HITOS_GESTACION.perro
}

export function calcularFechaParto(fechaCruce, especie = 'otro') {
  if (!fechaCruce) return null

  try {
    return addDays(parseDate(fechaCruce), getPeriodo(especie)).toISOString().slice(0, 10)
  } catch {
    return null
  }
}

export function calcularDiaActual(fechaCruce) {
  if (!fechaCruce) return 0

  try {
    return Math.max(1, differenceInCalendarDays(new Date(), parseDate(fechaCruce)) + 1)
  } catch {
    return 0
  }
}

export function calcularSemanaActual(fechaCruce) {
  const diaActual = calcularDiaActual(fechaCruce)
  return diaActual > 0 ? Math.max(1, Math.ceil(diaActual / 7)) : 0
}

export function calcularSemanasGestacion(fechaCruce) {
  return calcularSemanaActual(fechaCruce)
}

export function calcularProgreso(fechaCruce, especie = 'otro') {
  const diaActual = calcularDiaActual(fechaCruce)
  const duracionTotal = getPeriodo(especie)

  if (!diaActual || !duracionTotal) return 0

  return Math.max(0, Math.min(100, Math.round((diaActual / duracionTotal) * 100)))
}

export function calcularDiasRestantes(fechaParto) {
  if (!fechaParto) return null

  try {
    return differenceInCalendarDays(parseDate(fechaParto), new Date())
  } catch {
    return null
  }
}

export function obtenerHitosGestacion(gestacion, especie = 'otro') {
  if (!gestacion?.fechaCruce) return []

  return getHitos(especie).map((hito) => ({
    ...hito,
    id: `${gestacion.id}-${hito.dia}`,
    fecha: addDays(parseDate(gestacion.fechaCruce), hito.dia).toISOString().slice(0, 10),
  }))
}

export function obtenerHitosProximos(fechaCruce, especie = 'otro', cantidad = 3) {
  const diaActual = calcularDiaActual(fechaCruce)
  return getHitos(especie)
    .filter((hito) => hito.dia > diaActual)
    .slice(0, cantidad)
}

export function obtenerHitoActual(fechaCruce, especie = 'otro') {
  const diaActual = calcularDiaActual(fechaCruce)
  const hitos = getHitos(especie).filter((hito) => hito.dia <= diaActual)
  return hitos[hitos.length - 1] || null
}

export function generarAlertasGestacion(gestacion, especie = 'otro') {
  if (!gestacion?.fechaCruce) return []

  const diaActual = calcularDiaActual(gestacion.fechaCruce)

  return getHitos(especie)
    .filter((hito) => hito.dia >= diaActual && hito.dia <= diaActual + 3)
    .map((hito) => ({
      id: `gestacion-alerta-${gestacion.id}-${hito.dia}`,
      tipo: 'gestacion',
      prioridad: hito.dia >= getPeriodo(especie) - 7 ? 'alta' : 'media',
      mensaje: `[Gestacion] ${hito.titulo}`,
      fecha: addDays(parseDate(gestacion.fechaCruce), hito.dia).toISOString().slice(0, 10),
      detalle: hito.descripcion,
      hito,
    }))
}
