# 🧩 Juego Rompecabezas - Mario Galaxy

Juego interactivo de rompecabezas basado en React que implementa **React Context API** para gestionar el estado global de manera eficiente sin necesidad de prop drilling.

## 📖 Descripción

En este juego, debes arrastrar piezas de puzzle desde una bandeja hacia un lienzo vacío para completar la imagen de Mario Galaxy. Incluye múltiples niveles de dificultad y un sistema de temporizador.

## 🎯 Objetivos de Aprendizaje

Este proyecto se centra en dominar **React Context API**:

- ✅ Crear contextos para manejar estado global
- ✅ Usar `createContext()` y `useContext()`
- ✅ Implementar Custom Hooks para acceder al contexto
- ✅ Evitar prop drilling mediante Context Providers
- ✅ Compartir configuración entre múltiples componentes

## 🏗️ Arquitectura de Contextos

### 1. **ConfigContext** (`context/ConfigContext.jsx`)

Gestiona la configuración general del juego (dificultad seleccionada).

```jsx
import { createContext, useContext, useState } from 'react'

const ConfigContext = createContext(null)

export function ConfigProvider({ children }) {
  const [difficultyId, setDifficultyId] = useState(DIFFICULTIES[0].id)
  const selectedDifficulty = DIFFICULTIES.find((item) => item.id === difficultyId) ?? DIFFICULTIES[0]

  return (
    <ConfigContext.Provider
      value={{ difficultyId, difficultyOptions: DIFFICULTIES, selectedDifficulty, setDifficultyId }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) throw new Error('useConfig must be used inside ConfigProvider')
  return context
}
```

**Qué proporciona:**
- `difficultyId`: ID de la dificultad actual
- `selectedDifficulty`: Objeto con datos de la dificultad seleccionada
- `setDifficultyId`: Función para cambiar la dificultad
- `difficultyOptions`: Array de todas las dificultades disponibles

**Cómo usarlo:**
```jsx
import { useConfig } from './context/ConfigContext'

function MiComponente() {
  const { selectedDifficulty, setDifficultyId } = useConfig()
  
  return (
    <button onClick={() => setDifficultyId(2)}>
      Cambiar a dificultad 2
    </button>
  )
}
```

---

### 2. **PuzzleContext** (`context/PuzzleContext.jsx`)

Gestiona el estado dinámico del juego (tablero, piezas, victoria, tiempo, etc.).

```jsx
import { createContext, useContext } from 'react'
import { useConfig } from './ConfigContext.jsx'
import { usePuzzleGame } from '../../ArchivosJS/usePuzzleGame.js'

const PuzzleContext = createContext(null)

export function PuzzleProvider({ children }) {
  const { selectedDifficulty } = useConfig()
  const value = usePuzzleGame(selectedDifficulty)
  return <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>
}

export function usePuzzle() {
  const context = useContext(PuzzleContext)
  if (!context) throw new Error('usePuzzle must be used inside PuzzleProvider')
  return context
}
```

**Qué proporciona:** (via `usePuzzleGame`)
- Estado del tablero y piezas
- Funciones para manejar drag & drop
- Estado de victoria
- Tiempo transcurrido
- Contador de movimientos

**Cómo usarlo:**
```jsx
import { usePuzzle } from './context/PuzzleContext'

function LienzoGame() {
  const { board, handleDrop, isWon } = usePuzzle()
  
  return (
    <div onDrop={handleDrop}>
      {isWon && <p>¡Ganaste!</p>}
    </div>
  )
}
```

---

## 🔗 Estructura de Providers

```
PuzzleRaiz
├── ConfigProvider (proporciona dificultad)
│   └── PuzzleProvider (proporciona estado del juego)
│       └── PuzzleScreen
│           ├── PanelControl (usa useConfig)
│           ├── LienzoGame (usa usePuzzle)
│           └── Ganaste (usa usePuzzle)
```

## 📂 Estructura de Carpetas

```
rompecabezas/
├── ArchivosCSS/          # Estilos
│   ├── PuzzleBoard.css
│   ├── PuzzlePanel.css
│   └── Rompecabezas.css
├── ArchivosJS/           # Lógica
│   ├── PuzzleShapes.js
│   └── usePuzzleGame.js  # Custom Hook con lógica del juego
├── ArchivosJSX/          # Componentes
│   ├── PanelControl.jsx
│   ├── LienzoGame.jsx
│   ├── DifficultySelector.jsx
│   ├── Timer.jsx
│   ├── PuzzleRaiz.jsx    # Componente raíz con Providers
│   └── context/
│       ├── ConfigContext.jsx    # Contexto de configuración
│       └── PuzzleContext.jsx    # Contexto del juego
├── ImgRompe/             # Activos (imágenes)
└── README.md             # Este archivo

```

## 💡 Conceptos Clave

### ¿Por qué usar Context API?

Sin Context (prop drilling):
```jsx
<PuzzleRaiz difficulty={difficulty} setDifficulty={setDifficulty}>
  <PuzzleScreen difficulty={difficulty} setDifficulty={setDifficulty}>
    <PanelControl difficulty={difficulty} setDifficulty={setDifficulty}>
      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
    </PanelControl>
  </PuzzleScreen>
</PuzzleRaiz>
```

Con Context (solución limpia):
```jsx
<ConfigProvider>
  <PuzzleProvider>
    <PuzzleRaiz />
  </PuzzleProvider>
</ConfigProvider>

// En cualquier componente:
function DifficultySelector() {
  const { selectedDifficulty, setDifficultyId } = useConfig()
  // ¡Sin necesidad de pasar props!
}
```

### Custom Hooks para Context

Para mayor legibilidad y reutilización, encapsulamos el `useContext` en un custom hook:

```jsx
// ❌ Usar directamente
const context = useContext(ConfigContext)

// ✅ Usar custom hook
const { selectedDifficulty } = useConfig()
```

### Error Handling

Nuestros custom hooks incluyen validación:

```jsx
export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) throw new Error('useConfig must be used inside ConfigProvider')
  return context
}
```

## 🚀 Uso del Componente

```jsx
import PuzzleRaiz from './ArchivosJSX/PuzzleRaiz'

export default function App() {
  return <PuzzleRaiz />
}
```

## 🎮 Características

- 🎯 **Múltiples dificultades**: Fácil, Normal y Difícil
- ⏱️ **Temporizador**: Tiempo que toma completar el puzzle
- 🔄 **Contador de movimientos**: Número de piezas movidas
- 🏆 **Pantalla de victoria**: Muestra estadísticas
- 🎨 **Drag & Drop**: Sistema intuitivo de arrastrar piezas
- 📱 **Responsive**: Se adapta a diferentes tamaños de pantalla

## 📚 Lecciones Principales

1. **Crear un Contexto**: `createContext()` crea un contexto
2. **Provider**: Envuelve componentes que accederán al contexto
3. **Custom Hook**: `useContext()` dentro de un hook personalizado
4. **Composición**: Los contextos pueden usar otros contextos
5. **Validación**: Verificar que los hooks se usen dentro de Providers

## 🔍 Comparativa: Props vs Context

| Aspecto | Props | Context |
|---------|-------|---------|
| Alcance | Padre → Hijo inmediato | Acceso desde cualquier nivel |
| Código | Más prop drilling | Más limpio |
| Performance | Mejor para datos que cambian frecuentemente | Mejor para datos que se comparten ampliamente |
| Debugging | Más fácil rastrear | Requiere inspeccionar Provider |

## 🎓 Preguntas para Reflexionar

1. ¿Por qué separamos `ConfigContext` y `PuzzleContext`?
2. ¿Qué pasaría si accediéramos a `usePuzzle()` fuera de `PuzzleProvider`?
3. ¿Cómo podríamos agregar otro nivel de contexto (ej: preferencias de usuario)?
4. ¿Cuándo sería mejor usar Redux en lugar de Context?

---

**Última actualización:** Abril 2026  
**Módulo:** React.js Avanzado - Context API
