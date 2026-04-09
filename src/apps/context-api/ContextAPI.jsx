import { createContext, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './ContextAPI.css'

/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  App 07 — Manejo del Estado Global con Context API              ║
  ║                                                                  ║
  ║  CONCEPTOS:                                                      ║
  ║  • createContext()   — crea el "recipiente" del estado global   ║
  ║  • Provider          — componente que distribuye el estado      ║
  ║  • useContext()      — consume el contexto en cualquier hijo    ║
  ║  • Custom hook       — encapsula useContext, más limpio         ║
  ║  • Múltiples ctx     — varios Providers anidados                ║
  ╚══════════════════════════════════════════════════════════════════╝

  PROBLEMA QUE RESUELVE: "Prop Drilling"
  ─────────────────────────────────────────────────────────────────
  Sin Context (prop drilling):
    App → Layout → Sidebar → NavItem → Icono del carrito
           ↓ hay que pasar `items` como prop en CADA nivel ↓

  Con Context API:
    CarritoContext → cualquier componente accede directamente,
                     sin importar cuán profundo esté en el árbol.

  ÁRBOL DE COMPONENTES DE ESTA APP:
  ─────────────────────────────────────────────────────────────────
    <TemaProvider>          ← provee: { tema, toggleTema }
      <CarritoProvider>     ← provee: { items, agregar, quitar, total }
        <BarraNav />        ← consume: TemaContext + CarritoContext
        <Catalogo />        ← consume: TemaContext
          <TarjetaLibro />  ← consume: TemaContext + CarritoContext
        <PanelCarrito />    ← consume: TemaContext + CarritoContext
      </CarritoProvider>
    </TemaProvider>
*/

// ─────────────────────────────────────────────────────────────────
// PASO 1 — createContext()
// ─────────────────────────────────────────────────────────────────
// createContext() crea el objeto contexto.
// Recibe un valor por defecto (opcional). Lo guardamos en una variable
// con mayúscula para diferenciarlo de un hook o un componente normal.
// Buena práctica: un contexto por responsabilidad (tema ≠ carrito).
// ─────────────────────────────────────────────────────────────────
const TemaContext = createContext()
const CarritoContext = createContext()

// ─────────────────────────────────────────────────────────────────
// PASO 2 — Providers
// ─────────────────────────────────────────────────────────────────
// El Provider es un componente que:
//   1. Mantiene el estado (useState)
//   2. Expone ese estado a través de value={...}
//   3. Envuelve a todos los componentes que necesiten accederlo
//
// La prop `children` es clave: permite que el Provider envuelva
// cualquier árbol de componentes sin saber qué hay adentro.
// ─────────────────────────────────────────────────────────────────
function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro')

  // Esta función modifica el estado. Estará disponible para todos los hijos.
  const toggleTema = () => setTema(t => (t === 'claro' ? 'oscuro' : 'claro'))

  return (
    // value = lo que queremos compartir. Puede ser cualquier valor JS.
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  )
}

function CarritoProvider({ children }) {
  const [items, setItems] = useState([])

  // uid único por instancia: permite agregar el mismo libro varias veces
  const agregar = (producto) =>
    setItems(prev => [...prev, { ...producto, uid: Date.now() + Math.random() }])

  const quitar = (uid) =>
    setItems(prev => prev.filter(item => item.uid !== uid))

  const total = items.reduce((suma, item) => suma + item.precio, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, total }}>
      {children}
    </CarritoContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────
// PASO 3 — Custom Hooks (patrón recomendado)
// ─────────────────────────────────────────────────────────────────
// En lugar de escribir useContext(TemaContext) en cada componente,
// creamos nuestros propios hooks. Beneficios:
//   ✓ Más legible: useTema() en lugar de useContext(TemaContext)
//   ✓ Centralizamos la importación del contexto
//   ✓ Se puede agregar validación (ej: lanzar error si se usa fuera del Provider)
// ─────────────────────────────────────────────────────────────────
function useTema() {
  return useContext(TemaContext)
}

function useCarrito() {
  return useContext(CarritoContext)
}

// ─────────────────────────────────────────────────────────────────
// PASO 4 — Componentes consumidores
// ─────────────────────────────────────────────────────────────────
// Cada componente "pide" solo lo que necesita del contexto.
// No reciben props de sus padres para el estado global — lo obtienen
// directamente del contexto con los custom hooks.
// ─────────────────────────────────────────────────────────────────

// BarraNav consume AMBOS contextos:
// • TemaContext → para el botón de cambio de tema
// • CarritoContext → para mostrar la cantidad de ítems
function BarraNav() {
  const { tema, toggleTema } = useTema()
  const { items } = useCarrito()

  return (
    <nav className={`ctx-nav ctx-nav--${tema}`}>
      <span className="ctx-nav__titulo">📚 Librería Digital</span>
      <div className="ctx-nav__acciones">
        <button className="ctx-nav__btn-tema" onClick={toggleTema}>
          {tema === 'claro' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
        </button>
        <div className="ctx-nav__carrito">
          <span>🛒</span>
          {/* Badge con cantidad — se actualiza en todos lados al mismo tiempo */}
          {items.length > 0 && (
            <span className="ctx-nav__badge">{items.length}</span>
          )}
        </div>
      </div>
    </nav>
  )
}

// Datos estáticos del catálogo
const LIBROS = [
  { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', precio: 2500, emoji: '📗' },
  { id: 2, titulo: 'The Pragmatic Programmer', autor: 'Hunt & Thomas', precio: 2800, emoji: '📘' },
  { id: 3, titulo: "You Don't Know JS", autor: 'Kyle Simpson', precio: 1900, emoji: '📙' },
  { id: 4, titulo: 'Refactoring', autor: 'Martin Fowler', precio: 3100, emoji: '📕' },
]

// TarjetaLibro consume TemaContext (estilos) y CarritoContext (acción agregar)
function TarjetaLibro({ libro }) {
  const { tema } = useTema()
  const { agregar } = useCarrito()

  return (
    <div className={`ctx-libro ctx-libro--${tema}`}>
      <span className="ctx-libro__emoji">{libro.emoji}</span>
      <div className="ctx-libro__info">
        <h3>{libro.titulo}</h3>
        <p>{libro.autor}</p>
      </div>
      <div className="ctx-libro__footer">
        <span className="ctx-libro__precio">${libro.precio.toLocaleString()}</span>
        {/* Al hacer click llama a agregar() del contexto — sin prop drilling */}
        <button className="ctx-libro__btn" onClick={() => agregar(libro)}>
          + Agregar
        </button>
      </div>
    </div>
  )
}

function Catalogo() {
  const { tema } = useTema()
  return (
    <div className={`ctx-catalogo ctx-catalogo--${tema}`}>
      <h2>Catálogo</h2>
      <div className="ctx-catalogo__grilla">
        {LIBROS.map(libro => (
          // Pasamos el libro como prop (datos locales del componente)
          // El estado global (carrito, tema) lo obtiene TarjetaLibro del contexto
          <TarjetaLibro key={libro.id} libro={libro} />
        ))}
      </div>
    </div>
  )
}

// PanelCarrito consume CarritoContext para mostrar y gestionar ítems
function PanelCarrito() {
  const { tema } = useTema()
  const { items, quitar, total } = useCarrito()

  return (
    <div className={`ctx-panel ctx-panel--${tema}`}>
      <h2>Carrito <span className="ctx-panel__count">({items.length})</span></h2>

      {items.length === 0 ? (
        <p className="ctx-panel__vacio">Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="ctx-panel__lista">
            {items.map(item => (
              <li key={item.uid} className="ctx-panel__item">
                <span className="ctx-panel__item-nombre">
                  {item.emoji} {item.titulo}
                </span>
                <div className="ctx-panel__item-acciones">
                  <span>${item.precio.toLocaleString()}</span>
                  <button onClick={() => quitar(item.uid)} className="ctx-panel__quitar">
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="ctx-panel__total">
            Total: <strong>${total.toLocaleString()}</strong>
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PASO 5 — Composición: envolver con los Providers
// ─────────────────────────────────────────────────────────────────
// Los Providers se anidan. El estado de cada uno es independiente.
// Todo componente dentro de un Provider puede consumir su contexto.
//
// Regla: el Provider debe ser ANCESTRO del componente que consume.
// Si un componente intenta usar useCarrito() fuera de CarritoProvider,
// obtendrá undefined (o el valor por defecto de createContext).
// ─────────────────────────────────────────────────────────────────
function ContextAPI() {
  return (
    <div className="context-api">
      <div className="context-api__container">

        <Link to="/apps" className="context-api__volver">← Volver a aplicaciones</Link>

        <header className="context-api__header">
          <span className="context-api__modulo">Módulo 05 — React.js</span>
          <h1>Context API</h1>
          <p>
            Estado global sin prop drilling. Cambiá el tema y añadí libros desde
            cualquier componente — sin pasar props a través de niveles intermedios.
          </p>
        </header>

        {/*
          Anidamos los Providers aquí.
          TemaProvider envuelve a CarritoProvider, así ambos están disponibles
          para todos los componentes de la demo.
        */}
        <TemaProvider>
          <CarritoProvider>
            <BarraNav />
            <div className="context-api__layout">
              <Catalogo />
              <PanelCarrito />
            </div>
          </CarritoProvider>
        </TemaProvider>

        <div className="context-api__conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <code>createContext()</code>
              <span>Crea el "recipiente" del estado global compartido</span>
            </li>
            <li>
              <code>Provider</code>
              <span>Componente que envuelve la app y distribuye el estado a todos los hijos</span>
            </li>
            <li>
              <code>useContext()</code>
              <span>Hook nativo de React para consumir un contexto desde cualquier componente</span>
            </li>
            <li>
              <span className="concepto-texto">Custom Hook</span>
              <span>useTema() y useCarrito() encapsulan useContext para un código más limpio</span>
            </li>
            <li>
              <span className="concepto-texto">Múltiples contextos</span>
              <span>TemaContext y CarritoContext anidados — cada uno con su propia responsabilidad</span>
            </li>
            <li>
              <span className="concepto-texto">Prop Drilling</span>
              <span>El problema que Context resuelve: evitar pasar props por múltiples niveles</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default ContextAPI
