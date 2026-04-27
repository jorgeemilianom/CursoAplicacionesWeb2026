# SPEC-06 — PetBook: APIs de Pago (Futuras), UI Final y Deploy

## 🎯 PROMPT PARA CLAUDE CODE — ETAPA 6

> ⚠️ Esta es la etapa final. Asume que SPEC-01 a SPEC-05 están completamente implementados.

---

Esta etapa tiene tres objetivos:
1. **Integrar visualmente** las APIs de pago para que estén presentes en la UI aunque no sean funcionales aún
2. **Pulir el diseño y la experiencia** de toda la app
3. **Preparar el proyecto para deploy** en Vercel o Netlify

---

## 💳 APIs de Pago — Integración Visual (Futuras)

La estrategia es mostrar estas funcionalidades como reales en la interfaz, pero con un estado "próximamente" o "plan premium". Esto tiene dos ventajas: demuestra el potencial del producto y permite activarlas fácilmente cuando se tenga la suscripción.

---

### 📱 Twilio — WhatsApp y SMS

**Dónde aparece en la UI:**

En `Configuracion.jsx`, sección "Notificaciones", agregar:

```
┌──────────────────────────────────────────────────────────────┐
│  🔔 NOTIFICACIONES                                           │
│                                                              │
│  📧 Email (EmailJS)                          [●  Activado]  │
│     Recordatorios por correo electrónico                     │
│                                                              │
│  📱 WhatsApp                        [PRO] [○  Próximamente] │
│     Recibí alertas directo en WhatsApp                      │
│     ✨ Disponible en el plan PetBook Pro                    │
│                                                              │
│  💬 SMS                             [PRO] [○  Próximamente] │
│     Mensajes de texto a tu celular                          │
│     ✨ Disponible en el plan PetBook Pro                    │
│                                                              │
│  [Conocer plan Pro →]                                        │
└──────────────────────────────────────────────────────────────┘
```

**Implementar el servicio preparado (inactivo):**

```js
// En api/externalApis.js — Dejar preparado pero no llamar
export const enviarWhatsApp = async ({ numero, mensaje }) => {
  // ⚠️ FUNCIÓN PREPARADA — REQUIERE PLAN PRO
  // Activar cuando se cuente con credenciales Twilio

  if (!import.meta.env.VITE_TWILIO_ACCOUNT_SID ||
      import.meta.env.VITE_TWILIO_ACCOUNT_SID === "pendiente") {
    console.warn("Twilio no configurado. Función reservada para plan Pro.")
    return { success: false, reason: "not_configured" }
  }

  // Código listo para cuando se active:
  // const client = twilio(ACCOUNT_SID, AUTH_TOKEN)
  // return await client.messages.create({
  //   body: mensaje,
  //   from: "whatsapp:+14155238886",
  //   to: `whatsapp:${numero}`
  // })
}
```

---

### 🗺️ Google Maps Platform

**Dónde aparece en la UI:**

En `Veterinarias.jsx`, agregar un toggle en el header:

```
┌──────────────────────────────────────────────────────────────┐
│  🗺️ VETERINARIAS CERCANAS                                    │
│                                                              │
│  Mapa: [OpenStreetMap ●]  [Google Maps ○ PRO]               │
│                                                              │
│  OpenStreetMap → Gratuito, activo ahora                     │
│  Google Maps   → Mayor precisión + Street View              │
│                  ✨ Disponible en plan PetBook Pro           │
└──────────────────────────────────────────────────────────────┘
```

**Preparar el hook con switch:**

```js
// En hooks/useVeterinarias.js — agregar modo
const useVeterinarias = (lat, lng, modo = "openstreetmap") => {

  const fetchVeterinarias = async () => {
    if (modo === "google" && import.meta.env.VITE_GOOGLE_MAPS_API_KEY !== "pendiente") {
      // Usar Google Places API — REQUIERE KEY ACTIVA
      // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json
      //   ?location=${lat},${lng}&radius=5000&type=veterinary
      //   &key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    } else {
      // Usar Overpass API (OpenStreetMap) — activo y gratuito
      // ... lógica ya implementada en SPEC-05
    }
  }
}
```

---

### 📅 Google Calendar API

**Dónde aparece en la UI:**

En `Calendario.jsx`, agregar botón en el header:

```
┌──────────────────────────────────────────────────────────────┐
│  📅 CALENDARIO DE SALUD                    [Sincronizar con] │
│                                            [Google Calendar] │
│                                            [      PRO      ] │
│  Al sincronizar, los eventos de PetBook                      │
│  aparecerán en tu Google Calendar personal.                  │
│  ✨ Disponible en plan PetBook Pro                           │
└──────────────────────────────────────────────────────────────┘
```

**Preparar el servicio:**

```js
// En api/externalApis.js
export const sincronizarConGoogleCalendar = async (eventos) => {
  // ⚠️ FUNCIÓN PREPARADA — REQUIERE PLAN PRO + OAuth configurado
  if (import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID === "pendiente") {
    return { success: false, reason: "not_configured" }
  }
  // Código listo para activar con OAuth 2.0:
  // Autenticar con Google
  // Por cada evento: POST a Google Calendar API
}
```

---

### 🧠 Asistente IA Avanzado (Claude Opus)

En `AsistenteIA.jsx`, mostrar diferencia entre plan gratuito y pro:

```
┌──────────────────────────────────────────────────────────────┐
│  🤖 Asistente PetBook                                        │
│                                                              │
│  [Básico ●]  [Pro ○]                                        │
│   claude-haiku   claude-opus                                 │
│   Respuestas     Análisis más profundo,                      │
│   rápidas        historial clínico completo                  │
│                  ✨ Plan Pro                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Pulido Visual Final — UI/UX Completa

### Página Home.jsx (Landing pública)

La página de inicio para usuarios no logueados debe ser atractiva y convertir:

```
Hero:
- Logo PetBook animado
- Tagline: "La salud de tu mascota, siempre organizada"
- Subtítulo: "Vacunas, turnos, gestación y más. Todo en un lugar."
- CTA: [Crear cuenta gratis] [Ver demo]
- Imagen hero: ilustración de mascota con dueño feliz

Sección Features (cards con íconos):
💉 Historial de vacunas    📅 Calendario inteligente
🤰 Seguimiento de gestación  🗺️ Veterinarias cercanas
🤖 Asistente con IA        🔔 Alertas automáticas

Sección "Cómo funciona" (3 pasos):
1. Registrá a tu mascota
2. Cargá su historial de salud
3. Recibí alertas automáticas

Footer:
- Logo + descripción corta
- Links: Inicio | Funciones | Contacto | Términos
- Redes sociales
```

### Navbar.jsx — Estado final

```
[🐾 PetBook]          [Dashboard] [Mis Mascotas] [Calendario] [Veterinarias]
                                                               [🔔 3] [Avatar ▼]

Avatar dropdown:
├── Mi perfil
├── Configuración
├── [PRO] Conocer plan Pro ✨
└── Cerrar sesión
```

### 404 NotFound.jsx

```
Ilustración de mascota perdida
Título: "¡Ups! Esta página no existe"
Subtítulo: "Tu mascota también se perdió buscándola 🐾"
Botón: [Volver al inicio]
```

### Componente "Plan Pro" Badge

```jsx
// Componente reutilizable para marcar features premium
const ProBadge = ({ texto = "PRO" }) => (
  <span className="pro-badge">
    ✨ {texto}
  </span>
)
// Usar en: toggles de WhatsApp, SMS, Google Maps, Google Calendar
// Estilo: fondo degradado dorado, texto oscuro, borde redondeado
```

---

## 📄 Página: Configuracion.jsx — Completa

```
Secciones:

👤 Mi perfil
├── Foto de perfil (upload)
├── Nombre, email, teléfono
├── Ubicación (ciudad)
└── [Guardar cambios]

🔔 Notificaciones
├── Email (EmailJS) ← toggle activo
├── WhatsApp (Twilio) ← PRO, toggle deshabilitado
└── SMS (Twilio) ← PRO, toggle deshabilitado

📅 Preferencias
├── Anticipación de alertas (7, 15, 30 días antes)
├── Hora de las notificaciones
└── Idioma (español por defecto)

🔗 Integraciones
├── Google Calendar ← PRO
└── Estado de cada API (conectada / pendiente)

💎 Plan PetBook
├── Plan actual: Gratuito
├── [Conocer plan Pro] (botón que abre modal informativo)
└── Funciones Pro listadas

🔐 Seguridad
├── Cambiar contraseña
└── [Cerrar sesión en todos los dispositivos]
```

---

## 🚀 Deploy en Vercel

### Preparar para producción:

**1. Actualizar JSON Server para producción:**

Para el deploy, el JSON Server local no funciona. Opciones:

```
Opción A (recomendada para proyecto académico):
  Usar MockAPI.io — Permite crear una API REST en la nube gratis
  https://mockapi.io
  Reemplazar VITE_API_BASE_URL con la URL de MockAPI

Opción B (más profesional):
  Usar Railway.app o Render.com para deployar el JSON Server
  Plan gratuito disponible en ambas plataformas
```

**2. Crear `vercel.json` en la raíz:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Esto es necesario para que React Router funcione correctamente con las rutas.

**3. Variables de entorno en Vercel:**

En el dashboard de Vercel → Settings → Environment Variables, agregar todas las variables del `.env`:

```
VITE_OPENWEATHER_API_KEY  =  [tu key]
VITE_DOG_API_KEY          =  [tu key]
VITE_CAT_API_KEY          =  [tu key]
VITE_EMAILJS_SERVICE_ID   =  [tu id]
VITE_EMAILJS_TEMPLATE_ID  =  [tu id]
VITE_EMAILJS_PUBLIC_KEY   =  [tu key]
VITE_API_BASE_URL         =  [URL de MockAPI o Railway]
```

Las keys "pendiente" (Twilio, Google) se dejan como "pendiente" también en Vercel.

**4. Scripts en `package.json`:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "json-server --watch db.json --port 3001",
    "dev:full": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

Instalar concurrently para desarrollo:
```bash
npm install --save-dev concurrently
```

**5. Pasos de deploy:**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Desde la raíz del proyecto
vercel login
vercel

# 3. Seguir el asistente:
# ¿Configurar proyecto? → Y
# ¿Framework? → Vite
# ¿Directorio de build? → dist
# ¿Comando de build? → npm run build
```

---

## 📋 Checklist Final antes de entregar

### Funcionalidad
- [ ] Login y logout funcionando con persistencia en localStorage
- [ ] CRUD completo de mascotas
- [ ] CRUD completo de vacunas y desparasitaciones
- [ ] CRUD completo de consultas veterinarias
- [ ] Módulo de gestación con línea de tiempo
- [ ] Registro de parto y crías
- [ ] Calendario con eventos consolidados de todas las fuentes
- [ ] Sistema de alertas activo al iniciar la app
- [ ] Recordatorios manuales
- [ ] Widget de clima en el Dashboard
- [ ] Mapa de veterinarias con Leaflet
- [ ] Asistente IA (o preparado visualmente si no hay API key)
- [ ] Emails de recordatorio con EmailJS
- [ ] Features Pro visibles pero marcadas como próximamente
- [ ] Landing page pública atractiva
- [ ] Página 404 personalizada

### Rutas y navegación
- [ ] Rutas privadas redirigen a /login si no hay sesión
- [ ] Todas las rutas del router están implementadas
- [ ] Navegación consistente con Navbar activo en ruta actual

### Código
- [ ] Todos los Custom Hooks en `/hooks`
- [ ] Todos los Contextos en `/context`
- [ ] No hay lógica de negocio en los componentes de UI
- [ ] Variables de entorno en `.env` (nunca hardcodeadas)
- [ ] `.env` en `.gitignore`
- [ ] `.env.example` commiteado en el repositorio

### Deploy
- [ ] `vercel.json` creado
- [ ] Variables de entorno cargadas en Vercel
- [ ] API de producción (MockAPI o Railway) configurada
- [ ] URL de producción funcionando correctamente
- [ ] React Router funciona en todas las rutas en producción

---

## 🎯 Resultado final del proyecto completo

**PetBook** es una aplicación web React completa que:

- Permite a dueños de mascotas gestionar la salud de sus animales
- Consume 4 APIs externas reales (OpenWeatherMap, The Dog/Cat API, EmailJS, Anthropic)
- Tiene su propia API REST (JSON Server / MockAPI)
- Implementa React Context API para estado global
- Implementa al menos 6 Custom Hooks con lógica reutilizable
- Tiene sistema de alertas inteligentes
- Incluye módulo de seguimiento de gestación con línea de tiempo
- Muestra integración visual de APIs de pago preparadas para el futuro
- Está deployada en Vercel con dominio público

---

> 🏆 ¡Proyecto completado! Este nivel de implementación demuestra dominio de React moderno, consumo de APIs, manejo de estado global con Context, arquitectura de Custom Hooks y criterio de producto real. Es un portfolio project de alto impacto.
