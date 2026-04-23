# README4 — PetBook: Módulo Completo de Gestación

## 🎯 PROMPT PARA CLAUDE CODE — ETAPA 4

> ⚠️ Esta etapa asume que README1, README2 y README3 están completamente implementados y funcionando.

---

En esta etapa construimos el módulo más diferencial de PetBook: el seguimiento completo de la gestación de la mascota, desde el cruce hasta el registro de las crías y el post-parto.

---

## 🤰 Lógica de Gestación por Especie

Implementar en `utils/gestacionUtils.js` las siguientes constantes y funciones:

```js
// Períodos de gestación en días por especie
export const PERIODOS_GESTACION = {
  perro:    63,
  gato:     65,
  conejo:   31,
  hamster:  16,
  cobayo:   68,
  vaca:     283,
  oveja:    147,
  cabra:    150,
  cerdo:    114,
  otro:     63  // valor por defecto
}

// Hitos clave de gestación para perros y gatos (los más comunes)
// Expresados en días desde el cruce
export const HITOS_GESTACION = {
  perro: [
    { dia: 7,  titulo: "Fecundación", descripcion: "Los espermatozoides fecundan los óvulos." },
    { dia: 14, titulo: "Implantación embrionaria", descripcion: "Los embriones se implantan en el útero." },
    { dia: 21, titulo: "Primera ecografía", descripcion: "Ya es posible detectar actividad cardíaca." },
    { dia: 28, titulo: "Ecografía recomendada", descripcion: "Confirmar cantidad de cachorros." },
    { dia: 35, titulo: "Cambios físicos visibles", descripcion: "El abdomen comienza a crecer notoriamente." },
    { dia: 42, titulo: "Radiografía opcional", descripcion: "Contar esqueletos para saber cantidad exacta." },
    { dia: 49, titulo: "Preparar espacio de parto", descripcion: "Instalar caja de parto en lugar tranquilo." },
    { dia: 56, titulo: "Monitoreo de temperatura", descripcion: "Tomar temperatura rectal dos veces al día. Bajada indica parto en 24hs." },
    { dia: 60, titulo: "Parto inminente", descripcion: "⚠️ Atención permanente. Preparar todo para el parto." },
    { dia: 63, titulo: "Fecha probable de parto", descripcion: "El parto puede ocurrir entre el día 58 y 68." },
  ],
  gato: [
    { dia: 14, titulo: "Implantación embrionaria", descripcion: "Los embriones se implantan en el útero." },
    { dia: 21, titulo: "Primera ecografía", descripcion: "Se puede detectar actividad cardíaca fetal." },
    { dia: 30, titulo: "Ecografía confirmatoria", descripcion: "Confirmar cantidad de gatitos." },
    { dia: 35, titulo: "Abdomen visible", descripcion: "Crecimiento abdominal notorio." },
    { dia: 45, titulo: "Preparar espacio", descripcion: "La gata buscará un lugar tranquilo para parir." },
    { dia: 58, titulo: "Parto inminente", descripcion: "⚠️ Atención permanente requerida." },
    { dia: 65, titulo: "Fecha probable de parto", descripcion: "El parto puede ocurrir entre el día 60 y 70." },
  ]
}

// Funciones a implementar:

export const calcularFechaParto = (fechaCruce, especie) => {
  // Usar date-fns addDays()
  // Recibe fechaCruce (string ISO) y especie (string)
  // Devuelve fecha probable de parto como string ISO
}

export const calcularSemanaActual = (fechaCruce) => {
  // Devuelve número de semana actual de gestación (1 a N)
  // Usar date-fns differenceInDays() / 7
}

export const calcularDiaActual = (fechaCruce) => {
  // Devuelve día actual de gestación (1 a N)
}

export const calcularProgreso = (fechaCruce, especie) => {
  // Devuelve porcentaje de progreso (0 a 100)
  // diaActual / duracionTotal * 100
}

export const calcularDiasRestantes = (fechaParto) => {
  // Devuelve días que faltan para el parto (puede ser negativo si ya pasó)
}

export const obtenerHitosProximos = (fechaCruce, especie, cantidad = 3) => {
  // Devuelve los próximos N hitos que aún no ocurrieron
  // Filtra HITOS_GESTACION[especie] donde dia > diaActual
}

export const obtenerHitoActual = (fechaCruce, especie) => {
  // Devuelve el hito más reciente que ya ocurrió
}

export const generarAlertasGestacion = (gestacion, especie) => {
  // Genera array de alertas para AlertasContext basado en los hitos
  // Devuelve alertas para los próximos 3 días
}
```

---

## 🐣 Página: Gestacion.jsx

Esta es la pantalla completa del seguimiento de gestación. Recibe `mascotaId` por parámetro de ruta.

### Vista 1 — Sin gestación activa

```
Pantalla vacía con ilustración
Mensaje: "Firulais no tiene una gestación registrada"
Botón principal: "Registrar nueva gestación"
```

### Vista 2 — Gestación en curso

```
──────────────────────────────────────
🐾 GESTACIÓN DE FIRULAIS
──────────────────────────────────────

Header:
- Foto de la mascota
- Nombre y especie
- Badge: "EN CURSO" (verde pulsante)

Sección 1 — Datos principales (cards):
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 📅 Fecha cruce  │ │ 🗓️ Fecha parto  │ │ ⏳ Días restant │
│  01/11/2024     │ │  03/01/2025     │ │     12 días     │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Sección 2 — Barra de progreso:
Semana 7 de 9 ████████░░ 78%
"Día 49 de 63"

Sección 3 — Hito actual:
🎯 HOY: Preparar espacio de parto
"Instalar caja de parto en lugar tranquilo y silencioso"

Sección 4 — Línea de tiempo de hitos:
✅ Fecundación (día 7) — 01/11/2024
✅ Implantación embrionaria (día 14)
✅ Primera ecografía (día 21)
✅ Ecografía confirmatoria (día 28)
✅ Abdomen visible (día 35)
✅ Radiografía opcional (día 42)
🔵 Preparar espacio ← ESTÁS AQUÍ (día 49)
⭕ Monitoreo de temperatura (día 56)
⭕ Parto inminente (día 60)
⭕ Fecha probable de parto (día 63)

Sección 5 — Datos adicionales:
- Veterinario de seguimiento
- Crías esperadas: 5
- Notas de seguimiento (campo editable)

Sección 6 — Acciones:
- Botón: "Registrar parto / Nacimiento" (abre Vista 3)
- Botón: "Editar datos de gestación"
- Botón: "Cancelar gestación" (aborto espontáneo o pérdida)
```

### Vista 3 — Modal: Registro de Parto

```
Modal grande titulado "🎉 ¡Llegó el momento!"

Campos:
- Fecha y hora del parto *
- Tipo de parto (natural / cesárea)
- Cantidad de crías nacidas *
- Cantidad de crías nacidas vivas *
- Cantidad de crías nacidas sin vida (campo delicado, opcional)
- Peso promedio de las crías (gramos)
- Complicaciones (textarea, opcional)
- Veterinario presente
- Notas generales

Por cada cría (formulario dinámico, se agrega con botón "+"):
- Número / nombre provisional
- Sexo (macho / hembra / no determinado)
- Peso al nacer (gramos)
- Color / características
- Observaciones especiales

Botón: "Registrar nacimiento"
→ Cambia estado de gestación a "finalizada"
→ Crea registros de crías en db.json
→ Genera recordatorios automáticos de destete y primera vacuna
```

### Vista 4 — Post-parto

```
──────────────────────────────────────
🎉 CAMADA DE FIRULAIS
──────────────────────────────────────

Header:
- Fecha de nacimiento: 03/01/2025
- Tipo de parto: Natural
- Total crías: 5 (5 vivas)

Sección — Cards de cada cría:
┌──────────────┐
│ 🐕 Cría #1  │
│ Macho        │
│ Marrón       │
│ 350 gramos   │
│ [Ver / Editar]│
└──────────────┘

Recordatorios automáticos generados:
📅 Destete sugerido: 03/03/2025 (60 días)
💉 Primera vacuna cría #1: 03/03/2025
💉 Primera vacuna cría #2: 03/03/2025
...

Acciones por cría:
- "Crear ficha completa" → crea nueva mascota en db.json con datos de la cría
- "Marcar como adoptada/vendida" → cambia estado
- "Editar datos"
```

---

## 📋 Modal: Nueva Gestación

```
Campos:
- Mascota * (selector, solo hembras)
- Fecha del cruce / servicio *
- Tipo de cruce (natural / inseminación artificial)
- Macho reproductor (nombre, raza, opcional)
- Cantidad de crías esperadas (después de ecografía, opcional)
- Veterinario de seguimiento
- Notas iniciales

Al guardar:
→ POST /gestaciones
→ Calcular y guardar fechaProbableParto automáticamente
→ Generar recordatorios de hitos en /recordatorios
→ Agregar alertas de gestación al AlertasContext
```

---

## 🪝 Custom Hook: useGestacion.js

```js
const useGestacion = (mascotaId) => {

  // Estado
  const [gestacion, setGestacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch al montar
  // GET /gestaciones?mascotaId=X&estado=en_curso

  // Computed (usando gestacionUtils.js)
  const semanaActual       = calcularSemanaActual(gestacion?.fechaCruce)
  const diaActual          = calcularDiaActual(gestacion?.fechaCruce)
  const progreso           = calcularProgreso(gestacion?.fechaCruce, mascota?.especie)
  const diasRestantes      = calcularDiasRestantes(gestacion?.fechaPartoProbable)
  const hitoActual         = obtenerHitoActual(gestacion?.fechaCruce, mascota?.especie)
  const hitosProximos      = obtenerHitosProximos(gestacion?.fechaCruce, mascota?.especie)
  const tieneGestacion     = gestacion !== null && gestacion.estado === "en_curso"

  // Funciones
  const iniciarGestacion   = async (datos) => { /* POST /gestaciones */ }
  const registrarParto     = async (datos) => { /* PUT /gestaciones/:id + POST crías */ }
  const actualizarNotas    = async (notas) => { /* PATCH /gestaciones/:id */ }
  const cancelarGestacion  = async (motivo) => { /* PATCH /gestaciones/:id { estado: "cancelada" } */ }
  const crearFichaCria     = async (criaId) => { /* POST /mascotas con datos de la cría */ }

  return {
    gestacion, tieneGestacion, loading, error,
    semanaActual, diaActual, progreso, diasRestantes,
    hitoActual, hitosProximos,
    iniciarGestacion, registrarParto,
    actualizarNotas, cancelarGestacion, crearFichaCria
  }
}
```

---

## 🗄️ Actualizar db.json

Agregar la colección de crías:

```json
"crias": [
  {
    "id": 1,
    "gestacionId": 1,
    "mascotaMadreId": 1,
    "numero": 1,
    "nombre": "Cría #1",
    "sexo": "macho",
    "color": "marrón",
    "pesoNacimiento": 350,
    "fechaNacimiento": "2025-01-03",
    "estado": "vivo",
    "mascotaId": null,
    "observaciones": ""
  }
]
```

---

## 🔔 Alertas automáticas que genera el módulo

Al registrar una gestación, crear automáticamente estos recordatorios en `/recordatorios`:

```js
// Para cada hito de la especie correspondiente:
{
  mascotaId: X,
  usuarioId: Y,
  titulo: `[GESTACIÓN] ${hito.titulo} - ${mascota.nombre}`,
  fecha: addDays(fechaCruce, hito.dia),
  tipo: "gestacion",
  notificado: false,
  notas: hito.descripcion
}
```

---

## 🎨 Consideraciones de UI específicas

- La barra de progreso de gestación debe animarse al cargar la página
- Los hitos completados deben tener color verde con tilde ✅
- El hito actual debe tener un indicador pulsante azul 🔵
- Los hitos futuros deben verse en gris ⭕
- En los últimos 7 días antes del parto, mostrar banner de alerta especial con animación
- El registro de crías debe ser un formulario dinámico: el usuario suma crías con un botón "+"
- Usar emojis de especie para humanizar la interfaz

---

## ✅ Resultado esperado al final de esta etapa

- Módulo de gestación completo con línea de tiempo visual
- Cálculos automáticos de fecha de parto y semana actual
- Barra de progreso animada
- Modal de registro de parto con formulario dinámico de crías
- Vista post-parto con cards de cada cría
- Opción de crear ficha completa para cada cría
- Recordatorios automáticos generados al registrar la gestación
- Alertas en el sistema global cuando se acerca el parto
- Todo conectado al JSON Server

---

> ⚠️ IMPORTANTE: Este módulo solo debe habilitarse para mascotas de sexo "hembra". Agregar validación en el formulario y en el router. Si el usuario intenta acceder a /gestacion/:id de un macho, mostrar mensaje de error apropiado.
