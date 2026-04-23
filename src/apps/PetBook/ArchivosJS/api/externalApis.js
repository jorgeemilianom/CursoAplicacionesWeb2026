import axios from 'axios'
import { FALLBACK_RAZAS } from '../utils/constants'

export async function obtenerClimaActual() {
  return {
    ok: false,
    message: 'API externa pendiente de configurar en etapas siguientes.',
  }
}

export async function obtenerRazas(especie) {
  if (especie === 'perro') {
    const { data } = await axios.get('https://api.thedogapi.com/v1/breeds')
    return data.map((item) => item.name).filter(Boolean)
  }

  if (especie === 'gato') {
    const { data } = await axios.get('https://api.thecatapi.com/v1/breeds')
    return data.map((item) => item.name).filter(Boolean)
  }

  return FALLBACK_RAZAS[especie] || FALLBACK_RAZAS.otro
}

export async function obtenerVeterinariasCercanas() {
  return []
}
