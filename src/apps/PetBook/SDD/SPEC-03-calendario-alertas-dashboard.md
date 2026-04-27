# SPEC-03 — PetBook: Módulo de Calendario y Sistema de Alertas

## 🎯 PROMPT PARA CLAUDE CODE — ETAPA 3

> ⚠️ Esta etapa asume que SPEC-01 y SPEC-02 están completamente implementados y funcionando.

---

En esta etapa construimos el calendario interactivo de eventos de salud y el sistema de alertas/recordatorios. Es la pieza que hace la app realmente útil en el día a día.

---

## 📅 Página: Calendario.jsx

Implementar un calendario mensual interactivo. Opciones:

**Opción A (recomendada):** Usar la librería `react-calendar` o `react-big-calendar`
**Opción B:** Construir un calendario custom en React (más trabajo pero más control)

### Funcionalidades del calendario:

```
Vista mensual:
- Días con eventos marcados con puntos de colores
- Color verde → vacuna al día
- Color naranja → desparasitación
- Color rojo → evento vencido
- Color azul → consulta veterinaria agendada
- Color púrpura → hito de gestación
- Color celeste → recordatorio personal

Al hacer click en un día con eventos:
- Despliega lista de eventos de ese día
- Cada evento muestra: mascota, tipo, descripción
- Botón para marcar como completado
- Botón para editar el recordatorio

Panel lateral (o inferior en mobile):
- "Próximos eventos" → lista de los próximos 7 días
- Filtro por mascota (si el usuario tiene varias)
- Filtro por tipo de evento

Navegación:
- Anterior / Siguiente mes
- Botón "Hoy"
- Vista rápida del mes en curso con resumen
```

### ¿Cómo se puebla el calendario?

El calendario debe consolidar datos de múltiples fuentes:

```js
// Al cargar el calendario, obtener:
// 1. GET /vacunas → fechas "proxima" de todas las mascotas del usuario
// 2. GET /desparasitaciones → fechas "proxima"
// 3. GET /gestaciones → hitos calculados por semana
// 4. GET /recordatorios → recordatorios manuales del usuario
// 5. GET /consultas → consultas agendadas futuras

// Transformar todo a un array unificado de eventos:
const eventos = [
  {
    id: "vac-1",
    fecha: "2025-01-10",
    titulo: "Vacuna Antirrábica - Firulais",
    tipo: "vacuna",
    mascotaId: 1,
    mascotaNombre: "Firulais",
    completado: false
  },
  // ...
]
```

---

## 🔔 Sistema de Alertas

### AlertasContext.jsx (ampliar el de la Etapa 1)

```jsx
// Al iniciar la app (en el Provider, con useEffect):
// 1. Obtener todas las mascotas del usuario
// 2. Por cada mascota, verificar:
//    a. ¿Tiene vacunas vencidas? → alerta ROJA
//    b. ¿Tiene vacunas que vencen en 7 días? → alerta NARANJA
//    c. ¿Tiene vacunas que vencen en 30 días? → alerta AMARILLA
//    d. ¿Tiene gestación activa? → recordatorios de semana
//    e. ¿Tiene recordatorios para hoy? → alerta AZUL
// 3. Guardar array de alertas en el contexto
// 4. Mostrar badge con cantidad en la Navbar

// Estructura de una alerta:
{
  id: "alerta-1",
  tipo: "vacuna_vencida" | "vacuna_proxima" | "gestacion" | "recordatorio",
  prioridad: "alta" | "media" | "baja",
  mascotaId: 1,
  mascotaNombre: "Firulais",
  mensaje: "La vacuna Antirrábica de Firulais está vencida",
  fecha: "2025-01-10",
  leida: false
}
```

### AlertaBanner.jsx (componente compartido)

- Banner fijo en la parte superior del Dashboard
- Muestra la alerta de mayor prioridad no leída
- Botón "Ver todas" que abre modal con lista completa
- Botón X para descartar la alerta actual
- Si no hay alertas: no se muestra nada

### Panel de Notificaciones

En la Navbar: ícono de campana con badge de cantidad.

Al hacer click: dropdown con:
- Lista de alertas ordenadas por prioridad
- Cada alerta tiene ícono de tipo, mensaje, mascota y fecha
- Botón "Marcar como leída"
- Botón "Ir al evento" (navega a la sección correspondiente)
- "Marcar todas como leídas"

---

## 🪝 Custom Hook: useAlertas.js

```js
const useAlertas = (usuarioId) => {
  // Consume AlertasContext
  // También expone funciones de manejo

  const chequearVencimientos = async (mascotas) => {
    // Lógica completa de verificación
    // Llama a /vacunas, /desparasitaciones, /gestaciones, /recordatorios
    // Genera array de alertas
    // Actualiza AlertasContext
  }

  return {
    alertas,              // todas las alertas
    alertasNoLeidas,      // filtradas por leida: false
    cantidadNoLeidas,     // número para el badge
    alertasAltas,         // prioridad alta
    marcarLeida,          // función
    marcarTodasLeidas,    // función
    chequearVencimientos  // función
  }
}
```

---

## 📋 Página: Nuevo Recordatorio

Modal o página para que el usuario cree recordatorios manuales:

```
Campos:
- Mascota * (selector con las mascotas del usuario)
- Título del recordatorio *
- Fecha * (date picker)
- Hora (time picker, opcional)
- Tipo (vacuna / desparasitación / baño / peluquería / control / medicación / otro)
- Notas adicionales
- ¿Repetir? (no / mensual / trimestral / anual)

Al guardar: POST /recordatorios
```

---

## 📱 Dashboard.jsx — Vista principal post-login

El Dashboard debe ser una pantalla de resumen inteligente:

```
Header:
- Saludo personalizado: "¡Buen día, María! 🌞"
- Clima actual (ya integrado con OpenWeatherMap en Etapa 5)

Sección 1 — Alertas activas
- AlertaBanner con las alertas de mayor prioridad

Sección 2 — Mis mascotas (resumen)
- Scroll horizontal de MascotaCards reducidas
- Botón "Ver todas"

Sección 3 — Próximos eventos (próximos 7 días)
- Lista compacta de eventos del calendario
- Cada item: ícono tipo + mascota + descripción + fecha

Sección 4 — Acceso rápido
- Botones grandes a las secciones más usadas:
  "Nueva mascota" | "Agregar vacuna" | "Ver calendario" | "Veterinarias cercanas"

Sección 5 — Tip del día (estático o rotativo)
- Tips de salud animal, cuidado por especie, etc.
```

---

## 🪝 Custom Hook: useRecordatorios.js

```js
const useRecordatorios = (mascotaId = null) => {
  // Si mascotaId: GET /recordatorios?mascotaId=X
  // Si no: GET /recordatorios?usuarioId=Y (todos del usuario)

  // Funciones:
  // crearRecordatorio(datos) → POST /recordatorios
  // editarRecordatorio(id, datos) → PUT /recordatorios/:id
  // eliminarRecordatorio(id) → DELETE /recordatorios/:id
  // marcarCompletado(id) → PATCH /recordatorios/:id { notificado: true }

  // Computed:
  // recordatoriosHoy → los de fecha === hoy
  // recordatoriosProximos → los de los próximos 7 días
  // recordatoriosPasados → los vencidos no completados

  return { recordatorios, recordatoriosHoy, recordatoriosProximos,
           recordatoriosPasados, loading, error,
           crearRecordatorio, editarRecordatorio,
           eliminarRecordatorio, marcarCompletado }
}
```

---

## 🎨 Consideraciones de UI para esta etapa

- Los colores de los eventos en el calendario deben ser consistentes con los badges de la Etapa 2
- Las alertas de prioridad alta deben tener animación de pulso (CSS)
- El calendario debe ser responsive: en mobile mostrar vista de lista en lugar de grilla mensual
- Los recordatorios completados deben tener estilo tachado o desaturado

---

## ✅ Resultado esperado al final de esta etapa

- Calendario mensual con eventos de color de todas las mascotas del usuario
- Sistema de alertas funcionando al iniciar la app
- Badge con cantidad de alertas en Navbar
- Panel de notificaciones con lista completa
- Dashboard con resumen inteligente de alertas y próximos eventos
- CRUD completo de recordatorios manuales
- Filtros por mascota y tipo de evento en el calendario

---

> ⚠️ IMPORTANTE: El sistema de alertas se ejecuta una vez al cargar la app. Considerar actualizarlo si el usuario realiza cambios en vacunas o recordatorios.
