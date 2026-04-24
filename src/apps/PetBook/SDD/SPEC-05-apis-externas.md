# SPEC-05 — PetBook: Integración de APIs Externas Gratuitas

## 🎯 PROMPT PARA CLAUDE CODE — ETAPA 5

> ⚠️ Esta etapa asume que SPEC-01 a SPEC-04 están completamente implementados y funcionando.

---

En esta etapa integramos todas las APIs externas gratuitas: clima inteligente para mascotas, mapa de veterinarias cercanas y el asistente de salud con IA. También configuramos el archivo de variables de entorno para manejar todas las API keys de forma segura.

---

## 🔐 Variables de entorno

Crear el archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
# ── APIs GRATUITAS (activas) ──────────────────────────────────────

# OpenWeatherMap — https://openweathermap.org/api
# Plan gratuito: 1000 llamadas/día — Requiere registro gratuito
VITE_OPENWEATHER_API_KEY=tu_api_key_aqui
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# The Dog API — https://thedogapi.com
# Totalmente gratuita — Requiere registro para API key
VITE_DOG_API_KEY=tu_api_key_aqui
VITE_DOG_API_URL=https://api.thedogapi.com/v1

# The Cat API — https://thecatapi.com
# Totalmente gratuita — Requiere registro para API key
VITE_CAT_API_KEY=tu_api_key_aqui
VITE_CAT_API_URL=https://api.thecatapi.com/v1

# EmailJS — https://emailjs.com
# Plan gratuito: 200 emails/mes
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key

# Anthropic Claude — https://anthropic.com
# Pago por uso (muy bajo costo) — API key de Anthropic Console
VITE_ANTHROPIC_API_KEY=tu_api_key_aqui

# ── JSON Server (API propia) ──────────────────────────────────────
VITE_API_BASE_URL=http://localhost:3001

# ── APIs DE PAGO — FUTURAS (inactivas por ahora) ─────────────────
# Twilio — SMS y WhatsApp
VITE_TWILIO_ACCOUNT_SID=pendiente
VITE_TWILIO_AUTH_TOKEN=pendiente
VITE_TWILIO_PHONE_NUMBER=pendiente

# Google Maps Platform
VITE_GOOGLE_MAPS_API_KEY=pendiente

# Google Calendar API
VITE_GOOGLE_CALENDAR_CLIENT_ID=pendiente
```

Agregar `.env` al `.gitignore`. Crear también `.env.example` con las mismas claves pero sin valores, para compartir en el repositorio.

---

## 🌤️ API 1 — OpenWeatherMap: Clima inteligente para mascotas

### Dónde se ve: Dashboard + widget en FichaMascota

### Implementar en `hooks/useClima.js`:

```js
const useClima = (ciudad = "Posadas") => {
  // Endpoint: GET https://api.openweathermap.org/data/2.5/weather
  // Params: q={ciudad}&appid={API_KEY}&units=metric&lang=es

  // Estado: clima{}, loading, error

  // Computed: consejoMascota
  // Lógica de consejos según temperatura y condición:
  const generarConsejoMascota = (temp, condicion, humedad) => {
    if (temp >= 35)
      return { icono: "🌡️", alerta: "alta", mensaje: "Calor extremo: no saques a tu mascota al mediodía. Agua fresca siempre disponible." }
    if (temp >= 28)
      return { icono: "☀️", alerta: "media", mensaje: "Día caluroso: paseos cortos, preferentemente de mañana o tarde." }
    if (temp <= 5)
      return { icono: "🧊", alerta: "media", mensaje: "Hace frío: abriga a tu mascota si es de pelo corto. Cuidado con las patas en superficies frías." }
    if (condicion.includes("rain") || condicion.includes("lluvia"))
      return { icono: "🌧️", alerta: "baja", mensaje: "Día lluvioso: cuidado con la humedad. Sécales bien las patas al entrar." }
    if (humedad > 80)
      return { icono: "💧", alerta: "baja", mensaje: "Alta humedad: mayor riesgo de hongos. Mantén seco el pelaje." }
    return { icono: "✅", alerta: "ninguna", mensaje: "¡Buen día para un paseo! Las condiciones son ideales para tu mascota." }
  }

  return { clima, consejoMascota, loading, error }
}
```

### Widget de clima en el Dashboard:

```
┌─────────────────────────────────────────┐
│ 🌤️ Posadas, Misiones        28°C        │
│ Parcialmente nublado · Humedad: 75%     │
│                                         │
│ ☀️ Día caluroso: paseos cortos,         │
│    preferentemente de mañana o tarde.   │
└─────────────────────────────────────────┘
```

---

## 🗺️ API 2 — Leaflet.js + OpenStreetMap: Veterinarias cercanas

> Usar Leaflet.js con OpenStreetMap. Es 100% gratuito, sin tarjeta de crédito, ampliamente usado en producción.

### Instalar:
```bash
npm install leaflet react-leaflet
```

### Implementar en `hooks/useVeterinarias.js`:

```js
const useVeterinarias = (lat, lng, radio = 5000) => {
  // Usar la API de Overpass (OpenStreetMap) para buscar veterinarias cercanas
  // Endpoint: https://overpass-api.de/api/interpreter
  // Query Overpass QL para buscar amenity=veterinary en radio X metros

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:${radio},${lat},${lng});
      way["amenity"="veterinary"](around:${radio},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `

  // Transformar respuesta a array de veterinarias:
  // { id, nombre, lat, lng, direccion, telefono, horario }

  return { veterinarias, loading, error }
}
```

### Página Veterinarias.jsx:

```
┌────────────────────────────────────────────────────────────┐
│                  🗺️ VETERINARIAS CERCANAS                  │
│                                                            │
│  [Buscando tu ubicación...]                                │
│  Radio: ●──────○  5 km  [Buscar en esta zona]             │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │              MAPA LEAFLET / OPENSTREETMAP            │ │
│  │              (marcadores de veterinarias)            │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Lista de resultados:                                      │
│  ┌──────────────────────────────────────┐                 │
│  │ 🏥 Clínica Veterinaria San Martín    │                 │
│  │ 📍 Av. San Martín 1234 — 1.2 km     │                 │
│  │ 📞 3764-123456    🕐 Lun-Vie 8-20hs │                 │
│  │ [Cómo llegar]  [Llamar]             │                 │
│  └──────────────────────────────────────┘                 │
└────────────────────────────────────────────────────────────┘
```

### Funcionalidades del mapa:
- Detectar ubicación del usuario con `navigator.geolocation`
- Si el usuario no acepta la ubicación: mostrar input para ingresar ciudad manualmente
- Marcador especial para la ubicación del usuario (color diferente)
- Al hacer click en un marcador: popup con datos de la veterinaria
- Lista lateral sincronizada con el mapa
- Botón "Cómo llegar" que abre Google Maps con las coordenadas
- Botón "Guardar como mi veterinario" que guarda en la ficha de la mascota

---

## 🤖 API 3 — Anthropic Claude: Asistente de Salud Animal

### Página: AsistenteIA.jsx

```
┌────────────────────────────────────────────────────────────┐
│  🤖 ASISTENTE DE SALUD — PetBook AI                        │
│                                                            │
│  ⚠️ Este asistente es orientativo y no reemplaza          │
│     la consulta con un veterinario profesional.            │
│                                                            │
│  Seleccioná tu mascota: [Firulais 🐕 ▼]                   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │  🤖 Hola! Soy el asistente de salud de PetBook.     │ │
│  │     Puedo ayudarte con preguntas sobre la salud,     │ │
│  │     alimentación y comportamiento de Firulais.       │ │
│  │     ¿En qué te puedo ayudar hoy?                    │ │
│  │                                                      │ │
│  │  👤 Mi perro no quiere comer hace dos días           │ │
│  │                                                      │ │
│  │  🤖 Entiendo tu preocupación. La falta de apetito   │ │
│  │     en perros puede tener varias causas...           │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Escribe tu consulta aquí...]          [Enviar →]        │
│                                                            │
│  Sugerencias rápidas:                                      │
│  [¿Qué puedo darle de comer?]                             │
│  [¿Cuándo debería vacunarlo?]                              │
│  [¿Es normal este comportamiento?]                         │
└────────────────────────────────────────────────────────────┘
```

### Implementar en `api/externalApis.js`:

```js
export const consultarAsistenteIA = async (pregunta, datosMascota, historial) => {

  // Construir system prompt con datos de la mascota seleccionada
  const systemPrompt = `
    Eres un asistente de salud animal amigable y profesional de la app PetBook.
    Respondes en español, de forma clara, cálida y accesible.
    
    Datos de la mascota sobre la que se consulta:
    - Nombre: ${datosMascota.nombre}
    - Especie: ${datosMascota.especie}
    - Raza: ${datosMascota.raza}
    - Edad: ${datosMascota.edad}
    - Peso: ${datosMascota.peso} kg
    - Esterilizado: ${datosMascota.esterilizado ? "Sí" : "No"}
    
    IMPORTANTE: Siempre recordá al usuario que tus respuestas son orientativas
    y que ante cualquier síntoma preocupante debe consultar a un veterinario.
    No diagnostiques enfermedades. Sé empático y útil.
    Respuestas cortas y claras, máximo 150 palabras.
  `

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",   // modelo más económico
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...historial,                     // historial de la conversación
        { role: "user", content: pregunta }
      ]
    })
  })

  const data = await response.json()
  return data.content[0].text
}
```

### Implementar en `hooks/useAsistenteIA.js`:

```js
const useAsistenteIA = (mascota) => {
  const [mensajes, setMensajes] = useState([
    {
      role: "assistant",
      content: `¡Hola! Soy el asistente de PetBook. Puedo ayudarte con preguntas sobre la salud de ${mascota?.nombre}. ¿En qué te puedo ayudar?`
    }
  ])
  const [loading, setLoading] = useState(false)

  const enviarMensaje = async (texto) => {
    // 1. Agregar mensaje del usuario al estado
    // 2. setLoading(true)
    // 3. Llamar a consultarAsistenteIA con el historial
    // 4. Agregar respuesta al estado
    // 5. setLoading(false)
    // 6. Scroll automático al último mensaje
  }

  const limpiarChat = () => setMensajes([/* mensaje inicial */])

  return { mensajes, loading, enviarMensaje, limpiarChat }
}
```

---

## 📧 API 4 — EmailJS: Recordatorios por email

### Implementar en `api/externalApis.js`:

```js
import emailjs from '@emailjs/browser'

export const enviarRecordatorioPorEmail = async ({
  emailDestino,
  nombreDuenio,
  nombreMascota,
  tipoEvento,
  fechaEvento,
  descripcion
}) => {
  // Usar emailjs.send() con los parámetros del .env
  // Template variables: to_email, owner_name, pet_name,
  //                     event_type, event_date, description

  return await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      to_email:   emailDestino,
      owner_name: nombreDuenio,
      pet_name:   nombreMascota,
      event_type: tipoEvento,
      event_date: fechaEvento,
      description: descripcion
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  )
}
```

### ¿Cuándo se envían emails automáticos?
- 7 días antes de vencimiento de vacuna
- 3 días antes de vencimiento de vacuna (recordatorio urgente)
- Día del recordatorio manual si el usuario lo configura
- Cuando se acerca el parto (últimos 7 días de gestación)

Agregar en Configuracion.jsx una sección "Notificaciones" donde el usuario activa/desactiva los emails.

---

## ✅ Resultado esperado al final de esta etapa

- Widget de clima en el Dashboard con consejo para mascotas
- Mapa de Leaflet funcionando con veterinarias cercanas desde OpenStreetMap
- Lista sincronizada de veterinarias con botones de acción
- Chat con asistente IA funcionando (si se tiene API key de Anthropic)
- Emails automáticos de recordatorio con EmailJS
- Todas las API keys gestionadas desde el archivo .env
- Página de Configuración con toggle de notificaciones por email

---

> ⚠️ IMPORTANTE: El asistente de IA (Anthropic) tiene costo por uso. Si no se desea gastar en esta etapa, dejar la página AsistenteIA.jsx implementada visualmente pero con el botón de envío deshabilitado y un mensaje: "Función disponible próximamente". Esto se conecta con la SPEC-06 que muestra cómo dejar las APIs pagas preparadas para el futuro.
