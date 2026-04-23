import { differenceInCalendarDays, format, intervalToDuration, isBefore, isToday, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

function parseDate(fecha) {
  return typeof fecha === 'string' ? parseISO(fecha) : fecha
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 'Edad no disponible'

  try {
    const duration = intervalToDuration({
      start: parseDate(fechaNacimiento),
      end: new Date(),
    })

    const years = duration.years || 0
    const months = duration.months || 0

    if (years <= 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`
    }

    if (months <= 0) {
      return `${years} ${years === 1 ? 'ano' : 'anos'}`
    }

    return `${years} ${years === 1 ? 'ano' : 'anos'} y ${months} ${months === 1 ? 'mes' : 'meses'}`
  } catch {
    return 'Edad no disponible'
  }
}

export function formatearFecha(fecha, formato = 'dd/MM/yyyy') {
  if (!fecha) return 'Sin fecha'

  try {
    return format(parseDate(fecha), formato, { locale: es })
  } catch {
    return fecha
  }
}

export function formatearFechaLarga(fecha) {
  if (!fecha) return 'Sin fecha'

  try {
    return format(parseDate(fecha), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return fecha
  }
}

export function formatearFechaCorta(fecha) {
  return formatearFecha(fecha, 'dd/MM/yyyy')
}

export function diasHasta(fecha) {
  if (!fecha) return null

  try {
    return differenceInCalendarDays(parseDate(fecha), new Date())
  } catch {
    return null
  }
}

export function estaVencida(fecha) {
  if (!fecha) return false

  try {
    const parsed = parseDate(fecha)
    return isBefore(parsed, new Date()) && !isToday(parsed)
  } catch {
    return false
  }
}

export function venceProximamente(fecha, diasMargen = 30) {
  const dias = diasHasta(fecha)
  return dias !== null && dias >= 0 && dias <= diasMargen
}
