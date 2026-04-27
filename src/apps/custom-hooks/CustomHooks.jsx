import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCounter, useLocalStorage, useDebounce, useFetch } from './hooks'
import './CustomHooks.css'

/*
  Aplicación — Custom Hooks
  Semana 23: Módulo 06 — React Avanzado
  Conceptos: custom hooks, encapsulación de lógica, composición de hooks
*/

// ─── Demos ────────────────────────────────────────────────────────────────────

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0)
  return (
    <div className="ch-demo">
      <div className="ch-demo__display">{count}</div>
      <div className="ch-demo__controls">
        <button onClick={decrement}>−</button>
        <button className="ch-btn--secondary" onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}

function LocalStorageDemo() {
  const [note, setNote] = useLocalStorage('ch-nota', '')
  return (
    <div className="ch-demo">
      <p className="ch-demo__hint">El texto persiste aunque recargues la página.</p>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Escribí algo... se guarda automáticamente"
        rows={4}
      />
      {note && (
        <button className="ch-btn--secondary" onClick={() => setNote('')}>Limpiar</button>
      )}
    </div>
  )
}

function DebounceDemo() {
  const [input, setInput] = useState('')
  const debounced = useDebounce(input, 600)
  const isTyping  = input !== debounced

  return (
    <div className="ch-demo">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Escribí rápido para ver la diferencia..."
      />
      <div className="ch-demo__row">
        <span className="ch-demo__label">Valor real:</span>
        <span className="ch-demo__value">{input || '—'}</span>
      </div>
      <div className="ch-demo__row">
        <span className="ch-demo__label">Debounced:</span>
        <span className={`ch-demo__value ${isTyping ? 'ch-demo__value--waiting' : ''}`}>
          {isTyping ? 'esperando...' : (debounced || '—')}
        </span>
      </div>
    </div>
  )
}

function FetchDemo() {
  const [postId, setPostId] = useState(null)
  const url = postId ? `https://jsonplaceholder.typicode.com/posts/${postId}` : null
  const { data, loading, error } = useFetch(url)

  const fetchRandom = () => setPostId(Math.floor(Math.random() * 100) + 1)

  return (
    <div className="ch-demo">
      <button className="ch-btn--primary" onClick={fetchRandom}>
        Traer post aleatorio
      </button>
      {loading && <div className="ch-demo__status ch-demo__status--loading">Cargando...</div>}
      {error   && <div className="ch-demo__status ch-demo__status--error">Error: {error}</div>}
      {data    && (
        <div className="ch-demo__post">
          <div className="ch-demo__post-id">Post #{data.id}</div>
          <h3>{data.title}</h3>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  )
}

// ─── Metadatos de cada tab ─────────────────────────────────────────────────────

const TABS = ['useCounter', 'useLocalStorage', 'useDebounce', 'useFetch']

const DESCRIPTIONS = {
  useCounter:
    'Encapsula la lógica de un contador: estado + tres funciones. El componente no sabe cómo funciona por dentro, solo usa lo que el hook expone.',
  useLocalStorage:
    'Extiende useState para sincronizar automáticamente con localStorage. El componente usa un array igual que useState, sin saber nada de la persistencia.',
  useDebounce:
    'Retrasa la actualización de un valor hasta que el usuario deja de escribir. Evita llamadas innecesarias a APIs en cada keystroke.',
  useFetch:
    'Encapsula fetch + los tres estados de cualquier petición: data, loading y error. El componente solo decide qué mostrar en cada estado.',
}

const DEMOS = {
  useCounter:     CounterDemo,
  useLocalStorage: LocalStorageDemo,
  useDebounce:    DebounceDemo,
  useFetch:       FetchDemo,
}

const CODE = {
  useCounter:
`import { useState } from 'react'

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)

  const increment = () => setCount(c => c + 1)
  const decrement = () => setCount(c => c - 1)
  const reset     = () => setCount(initial)

  return { count, increment, decrement, reset }
}

// Uso en un componente
const { count, increment, decrement, reset } = useCounter(0)`,

  useLocalStorage:
`import { useState, useEffect } from 'react'

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored !== null ? JSON.parse(stored) : initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

// Uso — misma API que useState
const [nombre, setNombre] = useLocalStorage('nombre', '')`,

  useDebounce:
`import { useState, useEffect } from 'react'

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(timer) // ← cleanup!
  }, [value, delay])

  return debounced
}

// Uso
const debouncedQuery = useDebounce(searchInput, 600)
// → usar debouncedQuery para llamar a la API`,

  useFetch:
`import { useState, useEffect } from 'react'

function useFetch(url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    setError(null)
    setData(null)
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(e => { if (e !== 'AbortError') setError(String(e)) })
      .finally(() => setLoading(false))

    return () => controller.abort() // ← cleanup!
  }, [url])

  return { data, loading, error }
}`,
}

// ─── Componente principal ─────────────────────────────────────────────────────

function CustomHooks() {
  const [tab, setTab] = useState(TABS[0])
  const ActiveDemo = DEMOS[tab]

  return (
    <div className="ch">
      <div className="ch__container">

        <Link to="/apps" className="ch__volver">← Volver a aplicaciones</Link>

        <header className="ch__header">
          <span className="ch__modulo">Módulo 06 — React Avanzado</span>
          <h1>Custom Hooks</h1>
          <p>
            Los Custom Hooks son funciones que empiezan con <code>use</code> y encapsulan
            lógica reutilizable. Seleccioná un hook, probalo en vivo e inspeccioná su código.
          </p>
        </header>

        <div className="ch__tabs" role="tablist">
          {TABS.map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`ch__tab ${tab === t ? 'ch__tab--active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ch__panel">
          <p className="ch__desc">{DESCRIPTIONS[tab]}</p>

          <div className="ch__split">
            <div className="ch__side">
              <div className="ch__side-label">Demo en vivo</div>
              <ActiveDemo />
            </div>
            <div className="ch__side">
              <div className="ch__side-label">Código del hook</div>
              <div className="ch__code">
                <pre><code>{CODE[tab]}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div className="ch__reglas">
          <h2>Reglas de los Hooks</h2>
          <ul>
            <li>
              <code>Solo en componentes React</code>
              <span>Llamá hooks solo dentro de componentes funcionales o de otros custom hooks.</span>
            </li>
            <li>
              <code>Solo en el nivel superior</code>
              <span>No los llames dentro de ifs, loops ni funciones anidadas: React necesita el mismo orden en cada render.</span>
            </li>
            <li>
              <code>Nombre con "use"</code>
              <span>El prefijo <em>use</em> le indica a React y al linter que la función es un hook y debe seguir estas reglas.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default CustomHooks
