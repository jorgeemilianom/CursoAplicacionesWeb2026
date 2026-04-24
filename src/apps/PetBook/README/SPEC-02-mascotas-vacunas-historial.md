# SPEC-02 — PetBook: Módulo de Mascotas, Vacunas e Historial de Salud

## 🎯 PROMPT PARA CLAUDE CODE — ETAPA 2

> ⚠️ Esta etapa asume que SPEC-01 está completamente implementado y funcionando.

---

En esta etapa construimos el corazón de la app: el registro de mascotas, la ficha individual, el historial de vacunas y el historial de salud. Toda la lógica debe conectarse al JSON Server via Axios y usar los Contextos creados en la Etapa 1.

---

## 🐾 Página: MisMascotas.jsx

Esta es la pantalla principal después del login. Debe mostrar:

- Grid de cards con todas las mascotas del usuario logueado
- Cada card (`MascotaCard.jsx`) muestra:
  - Foto de la mascota (o avatar por defecto según especie)
  - Nombre, raza, edad calculada automáticamente con `date-fns`
  - Badge de estado: "Al día ✅" / "Atención requerida ⚠️" / "Vencido ❌"
  - Botón para ir a la ficha completa
- Botón flotante "+" para agregar nueva mascota
- Si no tiene mascotas, mostrar pantalla vacía con mensaje motivador y botón de agregar

```jsx
// El badge de estado se calcula con useVacunas(mascotaId):
// ✅ Al día → ninguna vacuna vencida ni próxima en 30 días
// ⚠️ Atención → hay vacuna que vence en menos de 30 días
// ❌ Vencido → hay vacuna con fecha pasada
```

---

## 🐕 Página: NuevaMascota.jsx

Formulario controlado en React con los siguientes campos:

```
Datos básicos:
- Nombre *
- Especie * (selector: perro, gato, conejo, hamster, ave, otro)
- Raza (al elegir especie, cargar razas desde The Dog API o The Cat API)
- Sexo * (macho / hembra)
- Fecha de nacimiento *
- Color / pelaje
- Peso (kg)

Datos de salud:
- ¿Está esterilizado/castrado? (switch)
- Número de microchip
- Veterinario de cabecera
- Teléfono del veterinario
- Contacto de emergencia

Foto:
- Upload de imagen (preview antes de guardar)
  Si no sube foto, asignar avatar SVG según especie
```

Al guardar: POST al JSON Server, actualizar MascotaContext, redirigir a la ficha.

---

## 📋 Página: FichaMascota.jsx

Esta es la página central de cada mascota. Recibe el `id` por parámetro de ruta. Debe tener tabs o secciones:

### Tab 1 — Perfil
- Foto grande, nombre, edad, raza, peso
- Datos del veterinario con botón de llamada (tel:)
- Botón editar datos
- Botón de peligro: eliminar mascota (con confirmación modal)

### Tab 2 — Vacunas
- Tabla con historial completo de vacunas
- Columnas: Vacuna, Fecha, Próxima dosis, Estado, Veterinario
- Cada fila tiene badge de estado con colores
- Botón "Agregar vacuna"
- Modal de nueva vacuna con campos:
  - Nombre de la vacuna *
  - Fecha de aplicación *
  - Fecha de próxima dosis *
  - Veterinario aplicador
  - Número de lote
  - Notas

### Tab 3 — Desparasitaciones
- Igual que vacunas pero para antiparasitarios:
  - Tipo (interna / externa / ambas)
  - Producto utilizado
  - Fecha, próxima dosis
  - Notas

### Tab 4 — Consultas veterinarias
- Lista cronológica de consultas
- Cada consulta muestra: fecha, motivo, diagnóstico, tratamiento, peso en esa fecha
- Botón "Nueva consulta"
- Modal de nueva consulta con:
  - Fecha *
  - Motivo de consulta *
  - Diagnóstico
  - Tratamiento indicado
  - Peso al momento de la consulta
  - Veterinario
  - Costo (opcional)
  - Notas / archivos adjuntos (opcional)

### Tab 5 — Diario de Salud
- Gráfico de evolución de peso (usar recharts o chart.js)
  - Eje X: fechas de consultas
  - Eje Y: peso en kg
- Sección de notas libres con fecha (como un diario)
- Cada nota puede tener texto y foto

---

## 🪝 Custom Hook: useVacunas.js

```js
// Implementar:
const useVacunas = (mascotaId) => {
  // Estado: vacunas[], desparasitaciones[], loading, error

  // Funciones:
  // fetchVacunas() → GET /vacunas?mascotaId=X
  // agregarVacuna(datos) → POST /vacunas
  // editarVacuna(id, datos) → PUT /vacunas/:id
  // eliminarVacuna(id) → DELETE /vacunas/:id

  // Computed:
  // vacunasVencidas → vacunas donde proxima < hoy
  // vacunasPorVencer → vacunas donde proxima está entre hoy y hoy+30días
  // estadoGeneral → "al_dia" | "atencion" | "vencido"

  return { vacunas, desparasitaciones, loading, error,
           vacunasVencidas, vacunasPorVencer, estadoGeneral,
           agregarVacuna, editarVacuna, eliminarVacuna }
}
```

---

## 🪝 Custom Hook: useMascota.js

```js
// Implementar:
const useMascota = (mascotaId) => {
  // Estado: mascota, consultas, loading, error

  // Funciones:
  // fetchMascota(id) → GET /mascotas/:id
  // actualizarMascota(id, datos) → PUT /mascotas/:id
  // eliminarMascota(id) → DELETE /mascotas/:id
  // agregarConsulta(datos) → POST /consultas
  // fetchConsultas() → GET /consultas?mascotaId=X

  // Computed:
  // edadCalculada → calcular años/meses con date-fns desde fechaNacimiento
  // pesoHistorial → array de {fecha, peso} de las consultas

  return { mascota, consultas, loading, error,
           edadCalculada, pesoHistorial,
           actualizarMascota, eliminarMascota, agregarConsulta }
}
```

---

## 🪝 Custom Hook: useRazas.js

```js
// Consumir The Dog API (https://api.thedogapi.com/v1/breeds)
// o The Cat API (https://api.thecatapi.com/v1/breeds)
// según la especie seleccionada

const useRazas = (especie) => {
  // Estado: razas[], loading, error
  // Al montar o cambiar especie: fetch a la API correspondiente
  // Transformar respuesta a array de strings para el select
  // Si especie no es perro ni gato: devolver lista hardcodeada básica

  return { razas, loading, error }
}
```

---

## 🎨 Componentes UI a completar

### MascotaCard.jsx
- Card con sombra suave y hover animado
- Avatar SVG por defecto según especie (perro 🐕, gato 🐈, conejo 🐇, etc.)
- Muestra badge de estado con colores:
  - Verde: al día
  - Amarillo: atención
  - Rojo: vencido

### Badge.jsx
```jsx
// Props: tipo ("success" | "warning" | "danger" | "info"), texto
// Colores y estilos según tipo
```

### Modal.jsx
```jsx
// Props: isOpen, onClose, title, children
// Overlay oscuro, animación de entrada, botón X para cerrar
// Cierra al hacer click fuera del modal
```

### ProgressBar.jsx
```jsx
// Props: valor (0-100), color, etiqueta
// Barra animada con porcentaje visible
```

---

## 🔧 Utilidades (utils/fechas.js)

```js
// Implementar las siguientes funciones con date-fns:

calcularEdad(fechaNacimiento)
// → devuelve string: "3 años y 2 meses" o "8 meses"

diasHasta(fecha)
// → devuelve número de días hasta esa fecha (negativo si ya pasó)

estaVencida(fecha)
// → booleano

venceProximamente(fecha, diasMargen = 30)
// → booleano

formatearFecha(fecha)
// → devuelve "15 de enero de 2025"

formatearFechaCorta(fecha)
// → devuelve "15/01/2025"
```

---

## ✅ Resultado esperado al final de esta etapa

- Grid de mascotas funcionando con datos del JSON Server
- Formulario de nueva mascota que guarda en JSON Server
- Ficha completa con tabs navegables
- Historial de vacunas con CRUD completo
- Historial de consultas con CRUD completo
- Badges de estado calculados dinámicamente
- Gráfico de evolución de peso funcionando
- The Dog API / The Cat API integradas para cargar razas
- Todos los Custom Hooks devolviendo datos reales

---

> ⚠️ IMPORTANTE: Revisar que el MascotaContext se actualice correctamente después de cada operación CRUD. Verificar que no haya re-renders innecesarios.
