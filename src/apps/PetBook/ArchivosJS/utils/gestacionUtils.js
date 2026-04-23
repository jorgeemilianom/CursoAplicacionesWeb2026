import { addDays, differenceInCalendarDays, parseISO } from 'date-fns'

const DIAS_GESTACION_PROMEDIO = 63

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
