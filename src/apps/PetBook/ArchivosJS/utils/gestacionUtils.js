import { addDays, differenceInCalendarDays, parseISO } from 'date-fns'

const DIAS_GESTACION_PROMEDIO = 63
const HITOS_GESTACION = [
  { semana: 1, titulo: 'Control inicial', descripcion: 'Confirmar el seguimiento y registrar sintomas tempranos.' },
  { semana: 3, titulo: 'Cambio nutricional', descripcion: 'Ajustar alimento y descanso con indicacion veterinaria.' },
  { semana: 5, titulo: 'Seguimiento fetal', descripcion: 'Semana ideal para reforzar controles y preparar el parto.' },
  { semana: 7, titulo: 'Preparar paridera', descripcion: 'Ultimos ajustes antes del nacimiento esperado.' },
  { semana: 9, titulo: 'Parto probable', descripcion: 'Ventana estimada de nacimiento y control cercano.' },
]

export function calcularFechaParto(fechaCruce) {
  if (!fechaCruce) return null

  try {
    return addDays(parseISO(fechaCruce), DIAS_GESTACION_PROMEDIO).toISOString().slice(0, 10)
  } catch {
    return null
  }
}

export function calcularSemanasGestacion(fechaCruce) {
  if (!fechaCruce) return 0

  try {
    const dias = differenceInCalendarDays(new Date(), parseISO(fechaCruce))
    return Math.max(0, Math.floor(dias / 7))
  } catch {
    return 0
  }
}

export function obtenerHitosGestacion(gestacion) {
  if (!gestacion?.fechaCruce) return []

  return HITOS_GESTACION.map((hito) => ({
    id: `${gestacion.id}-semana-${hito.semana}`,
    semana: hito.semana,
    fecha: addDays(parseISO(gestacion.fechaCruce), hito.semana * 7).toISOString().slice(0, 10),
    titulo: hito.titulo,
    descripcion: hito.descripcion,
  }))
}
