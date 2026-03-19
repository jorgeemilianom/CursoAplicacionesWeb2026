import { useState } from 'react'
import { Link } from 'react-router-dom'
import './HolaMundo.css'

/*
  Aplicación 01 — Hola Mundo
  Conceptos: useState, onChange, onKeyDown, renderizado condicional
*/
function HolaMundo() {
  const [nombre, setNombre] = useState('')
  const [saludo, setSaludo] = useState('')

  const saludar = () => {
    if (nombre.trim() !== '') {
      setSaludo(`¡Hola, ${nombre}! Bienvenido al mundo del desarrollo web 🚀`)
    }
  }

  const limpiar = () => {
    setNombre('')
    setSaludo('')
  }

  return (
    <div className="hola-mundo">
      <div className="hola-mundo__container">

        <Link to="/apps" className="hola-mundo__volver">← Volver a aplicaciones</Link>

        <header className="hola-mundo__header">
          <span className="hola-mundo__modulo">Módulo 05 — React.js</span>
          <h1>Hola Mundo</h1>
          <p>Tu primera aplicación interactiva con React. Ingresá tu nombre y presioná el botón.</p>
        </header>

        <div className="hola-mundo__app">
          <div className="hola-mundo__form">
            <label htmlFor="nombre">Tu nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saludar()}
              placeholder="Ej: María"
              autoFocus
            />
            <div className="hola-mundo__botones">
              <button onClick={saludar} className="btn-saludar">Saludar</button>
              {saludo && (
                <button onClick={limpiar} className="btn-limpiar">Limpiar</button>
              )}
            </div>
          </div>

          {saludo && (
            <div className="hola-mundo__saludo">
              {saludo}
            </div>
          )}
        </div>

        <div className="hola-mundo__conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <code>useState</code>
              <span>Gestionar el estado local de un componente</span>
            </li>
            <li>
              <code>onChange</code>
              <span>Escuchar cambios en un input y actualizar el estado</span>
            </li>
            <li>
              <code>onClick</code>
              <span>Ejecutar una función al hacer clic en un botón</span>
            </li>
            <li>
              <code>onKeyDown</code>
              <span>Detectar teclas presionadas (en este caso, Enter)</span>
            </li>
            <li>
              <span className="concepto-texto">Renderizado condicional</span>
              <span>Mostrar el saludo solo cuando existe un valor</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default HolaMundo
