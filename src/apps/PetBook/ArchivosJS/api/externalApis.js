import emailjs from '@emailjs/browser'
import axios from 'axios'
import { calcularEdad } from '../utils/fechas'
import { FALLBACK_RAZAS } from '../utils/constants'

const OPENWEATHER_BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const DOG_API_URL = import.meta.env.VITE_DOG_API_URL || 'https://api.thedogapi.com/v1'
const DOG_API_KEY = import.meta.env.VITE_DOG_API_KEY
const CAT_API_URL = import.meta.env.VITE_CAT_API_URL || 'https://api.thecatapi.com/v1'
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

function sanitizeOverpass(text) {
  return String(text || '')
    .replace(/[<>]/g, '')
    .trim()
}

function getAnthropicDisabledMessage() {
  return 'Funcion disponible proximamente. Configura la API key de Anthropic para habilitar el asistente.'
}

export async function obtenerClimaActual(ciudad = 'Posadas') {
  if (!OPENWEATHER_API_KEY) {
    return {
      ok: false,
      ciudad,
      message: 'Configura VITE_OPENWEATHER_API_KEY para ver el clima en tiempo real.',
    }
  }

  const { data } = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
    params: {
      q: ciudad,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'es',
    },
  })

  return {
    ok: true,
    ciudad: data.name,
    temperatura: Math.round(data.main.temp),
    condicion: data.weather?.[0]?.description || 'Sin dato',
    humedad: data.main.humidity,
    icono: data.weather?.[0]?.icon || '',
    resumen: `${data.name} - ${Math.round(data.main.temp)}°C`,
  }
}

export async function obtenerRazas(especie) {
  if (especie === 'perro') {
    const { data } = await axios.get(`${DOG_API_URL}/breeds`, {
      headers: DOG_API_KEY ? { 'x-api-key': DOG_API_KEY } : {},
    })
    return data.map((item) => item.name).filter(Boolean)
  }

  if (especie === 'gato') {
    const { data } = await axios.get(`${CAT_API_URL}/breeds`, {
      headers: CAT_API_KEY ? { 'x-api-key': CAT_API_KEY } : {},
    })
    return data.map((item) => item.name).filter(Boolean)
  }

  return FALLBACK_RAZAS[especie] || FALLBACK_RAZAS.otro
}

export async function obtenerVeterinariasCercanas(lat, lng, radio = 5000) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:${radio},${lat},${lng});
      way["amenity"="veterinary"](around:${radio},${lat},${lng});
    );
    out center tags;
  `

  const { data } = await axios.post('https://overpass-api.de/api/interpreter', query, {
    headers: { 'Content-Type': 'text/plain' },
  })

  return (data.elements || []).map((item) => ({
    id: item.id,
    nombre: sanitizeOverpass(item.tags?.name) || 'Veterinaria sin nombre',
    lat: item.lat || item.center?.lat,
    lng: item.lon || item.center?.lon,
    direccion: [
      sanitizeOverpass(item.tags?.['addr:street']),
      sanitizeOverpass(item.tags?.['addr:housenumber']),
      sanitizeOverpass(item.tags?.['addr:city']),
    ]
      .filter(Boolean)
      .join(' '),
    telefono: sanitizeOverpass(item.tags?.phone),
    horario: sanitizeOverpass(item.tags?.opening_hours),
  }))
}

export async function geocodificarCiudad(ciudad) {
  const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: ciudad,
      format: 'json',
      limit: 1,
    },
    headers: {
      Accept: 'application/json',
    },
  })

  const resultado = data?.[0]

  if (!resultado) {
    throw new Error('No se encontro la ciudad indicada.')
  }

  return {
    lat: Number(resultado.lat),
    lng: Number(resultado.lon),
    label: resultado.display_name,
  }
}

export async function consultarAsistenteIA(pregunta, datosMascota, historial = []) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error(getAnthropicDisabledMessage())
  }

  const systemPrompt = `
    Eres un asistente de salud animal amigable y profesional de la app PetBook.
    Respondes en espanol, de forma clara, calida y accesible.

    Datos de la mascota sobre la que se consulta:
    - Nombre: ${datosMascota.nombre}
    - Especie: ${datosMascota.especie}
    - Raza: ${datosMascota.raza}
    - Edad: ${datosMascota.edad}
    - Peso: ${datosMascota.peso} kg
    - Esterilizado: ${datosMascota.esterilizado ? 'Si' : 'No'}

    IMPORTANTE: Siempre recuerda al usuario que tus respuestas son orientativas
    y que ante cualquier sintoma preocupante debe consultar a un veterinario.
    No diagnostiques enfermedades. Se empatico y util.
    Respuestas cortas y claras, maximo 150 palabras.
  `

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      system: systemPrompt,
      messages: [...historial, { role: 'user', content: pregunta }],
    }),
  })

  if (!response.ok) {
    throw new Error('No fue posible consultar al asistente en este momento.')
  }

  const data = await response.json()
  return data.content?.[0]?.text || 'No se recibio respuesta del asistente.'
}

export async function enviarRecordatorioPorEmail({
  emailDestino,
  nombreDuenio,
  nombreMascota,
  tipoEvento,
  fechaEvento,
  descripcion,
}) {
  if (
    !import.meta.env.VITE_EMAILJS_SERVICE_ID ||
    !import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
    !import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  ) {
    return {
      ok: false,
      message: 'Configura EmailJS para habilitar el envio automatico de emails.',
    }
  }

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      to_email: emailDestino,
      owner_name: nombreDuenio,
      pet_name: nombreMascota,
      event_type: tipoEvento,
      event_date: fechaEvento,
      description: descripcion,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  )
}

export function construirDatosMascotaIA(mascota) {
  return {
    nombre: mascota?.nombre || 'Mascota',
    especie: mascota?.especie || 'Sin dato',
    raza: mascota?.raza || 'Sin dato',
    edad: calcularEdad(mascota?.fechaNacimiento),
    peso: mascota?.peso || 0,
    esterilizado: Boolean(mascota?.esterilizado),
  }
}

export function asistenteDisponible() {
  return Boolean(ANTHROPIC_API_KEY)
}
