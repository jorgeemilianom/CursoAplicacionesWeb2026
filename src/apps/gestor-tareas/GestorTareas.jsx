import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './GestorTareas.css'

/*
  CRUD completo:
  C → agregar()       crear tarea
  R → tareasFiltradas leer / filtrar tareas
  U → guardarEdicion() / toggleCompletada()  actualizar tarea
  D → eliminar()      borrar tarea
*/

function GestorTareas() {
  // Lazy initializer: lee localStorage solo en el primer render
  const [tareas, setTareas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('eprenda-tareas')) ?? []
    } catch {
      return []
    }
  })

  const [texto, setTexto] = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const [filtro, setFiltro] = useState('todas')
  const [editandoId, setEditandoId] = useState(null)
  const [textoEdit, setTextoEdit] = useState('')

  // Cada vez que cambian las tareas, las guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('eprenda-tareas', JSON.stringify(tareas))
  }, [tareas])

  // ── CREATE ────────────────────────────────────────────
  const agregar = () => {
    if (!texto.trim()) return
    const nuevaTarea = {
      id: Date.now(),
      texto: texto.trim(),
      prioridad,
      completada: false,
      fecha: new Date().toLocaleDateString('es-AR'),
    }
    setTareas([nuevaTarea, ...tareas])
    setTexto('')
  }

  // ── UPDATE: marcar como completada ───────────────────
  const toggleCompletada = (id) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    ))
  }

  // ── UPDATE: edición de texto ──────────────────────────
  const iniciarEdicion = (tarea) => {
    setEditandoId(tarea.id)
    setTextoEdit(tarea.texto)
  }

  const guardarEdicion = (id) => {
    if (!textoEdit.trim()) return
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, texto: textoEdit.trim() } : t
    ))
    setEditandoId(null)
  }

  const cancelarEdicion = () => setEditandoId(null)

  // ── DELETE ────────────────────────────────────────────
  const eliminar = (id) => {
    setTareas(tareas.filter(t => t.id !== id))
  }

  const limpiarCompletadas = () => {
    setTareas(tareas.filter(t => !t.completada))
  }

  // ── READ / FILTER ─────────────────────────────────────
  const tareasFiltradas = tareas.filter(t => {
    if (filtro === 'pendientes') return !t.completada
    if (filtro === 'completadas') return t.completada
    return true
  })

  const conteo = {
    todas: tareas.length,
    pendientes: tareas.filter(t => !t.completada).length,
    completadas: tareas.filter(t => t.completada).length,
  }

  return (
    <div className="gestor">
      <div className="gestor__container">

        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="app-header">
          <span className="app-modulo">Módulo 05 — React.js</span>
          <h1>Gestor de Tareas</h1>
          <p>
            CRUD completo con persistencia en <code>localStorage</code>.
            Tus tareas se guardan aunque cierres el navegador.
          </p>
        </header>

        {/* ── FORMULARIO (CREATE) ── */}
        <div className="gestor__form">
          <input
            type="text"
            className="gestor__input"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
            placeholder="Escribí una nueva tarea..."
          />
          <select
            className="gestor__select"
            value={prioridad}
            onChange={e => setPrioridad(e.target.value)}
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          <button className="gestor__btn-agregar" onClick={agregar}>
            + Agregar
          </button>
        </div>

        {/* ── FILTROS (READ) ── */}
        <div className="gestor__filtros">
          {['todas', 'pendientes', 'completadas'].map(f => (
            <button
              key={f}
              className={`gestor__filtro ${filtro === f ? 'gestor__filtro--activo' : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="gestor__filtro-count">{conteo[f]}</span>
            </button>
          ))}
        </div>

        {/* ── LISTA (READ + UPDATE + DELETE) ── */}
        <ul className="gestor__lista">
          {tareasFiltradas.length === 0 && (
            <li className="gestor__vacia">
              {filtro === 'todas'
                ? 'No hay tareas todavía. ¡Agregá la primera!'
                : `No hay tareas ${filtro}.`}
            </li>
          )}

          {tareasFiltradas.map(tarea => (
            <li
              key={tarea.id}
              className={`tarea ${tarea.completada ? 'tarea--completada' : ''}`}
            >
              {/* Checkbox */}
              <button
                className={`tarea__check ${tarea.completada ? 'tarea__check--activo' : ''}`}
                onClick={() => toggleCompletada(tarea.id)}
                aria-label={tarea.completada ? 'Marcar pendiente' : 'Marcar completada'}
              >
                {tarea.completada && '✓'}
              </button>

              {/* Contenido: modo lectura o edición */}
              <div className="tarea__cuerpo">
                {editandoId === tarea.id ? (
                  <input
                    className="tarea__edit-input"
                    value={textoEdit}
                    onChange={e => setTextoEdit(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') guardarEdicion(tarea.id)
                      if (e.key === 'Escape') cancelarEdicion()
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="tarea__texto">{tarea.texto}</span>
                    <div className="tarea__meta">
                      <span className={`tarea__prioridad tarea__prioridad--${tarea.prioridad}`}>
                        {tarea.prioridad}
                      </span>
                      <span className="tarea__fecha">{tarea.fecha}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Acciones */}
              <div className="tarea__acciones">
                {editandoId === tarea.id ? (
                  <>
                    <button className="btn-acc btn-acc--guardar" onClick={() => guardarEdicion(tarea.id)}>
                      Guardar
                    </button>
                    <button className="btn-acc btn-acc--cancelar" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-acc btn-acc--editar" onClick={() => iniciarEdicion(tarea)}>
                      Editar
                    </button>
                    <button className="btn-acc btn-acc--eliminar" onClick={() => eliminar(tarea.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {conteo.completadas > 0 && (
          <button className="gestor__limpiar" onClick={limpiarCompletadas}>
            Limpiar {conteo.completadas} tarea{conteo.completadas > 1 ? 's' : ''} completada{conteo.completadas > 1 ? 's' : ''}
          </button>
        )}

        <div className="app-conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <span className="tag-neutro">CRUD</span>
              <span>Crear, Leer, Actualizar y Eliminar — las 4 operaciones básicas de datos</span>
            </li>
            <li>
              <code>useState (lazy init)</code>
              <span>Inicializar el estado leyendo de localStorage solo en el primer render</span>
            </li>
            <li>
              <code>useEffect</code>
              <span>Sincronizar el estado con localStorage cada vez que cambia</span>
            </li>
            <li>
              <code>Array.filter()</code>
              <span>Filtrar tareas por estado (todas / pendientes / completadas)</span>
            </li>
            <li>
              <code>Array.map()</code>
              <span>Actualizar un elemento del array de forma inmutable</span>
            </li>
            <li>
              <code>localStorage</code>
              <span>Guardar y recuperar datos en el navegador entre sesiones</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default GestorTareas
