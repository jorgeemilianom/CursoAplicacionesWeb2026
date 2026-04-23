import { memo, useState, useEffect, useMemo, useCallback } from 'react'
import './ContactosBugueados.css'

const CONTACTOS_INICIALES = [
  { id: 1, nombre: 'Ana García',       email: 'ana@ejemplo.com',    telefono: '555-0101', favorito: false },
  { id: 2, nombre: 'Carlos López',     email: 'carlos@ejemplo.com', telefono: '555-0102', favorito: true  },
  { id: 3, nombre: 'María Rodríguez',  email: 'maria@ejemplo.com',  telefono: '555-0103', favorito: false },
  { id: 4, nombre: 'Juan Martínez',    email: 'juan@ejemplo.com',   telefono: '555-0104', favorito: false },
  { id: 5, nombre: 'Laura Sánchez',    email: 'laura@ejemplo.com',  telefono: '555-0105', favorito: true  },
]

const TarjetaContacto = memo(function TarjetaContacto({ contacto, onEliminar, onToggleFavorito }) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className={`tarjeta ${contacto.favorito ? 'tarjeta--favorita' : ''}`}>
      <div className="tarjeta__cabecera">
        <div className="tarjeta__avatar">
          {contacto.nombre.charAt(0)}
        </div>
        <div className="tarjeta__info">
          <strong className="tarjeta__nombre">{contacto.nombre}</strong>
          <span className="tarjeta__email">{contacto.email}</span>
        </div>
        <button
          className={`btn-estrella ${contacto.favorito ? 'btn-estrella--activo' : ''}`}
          onClick={() => onToggleFavorito(contacto.id)}
          title={contacto.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          ★
        </button>
      </div>

      <div className="tarjeta__pie">
        <button className="btn-ver-mas" onClick={() => setExpandido(e => !e)}>
          {expandido ? '▲ Ocultar' : '▼ Ver más'}
        </button>
        <button className="btn-eliminar" onClick={() => onEliminar(contacto.id)}>
          Eliminar
        </button>
      </div>

      {expandido && (
        <div className="tarjeta__detalles">
          <span>📞 {contacto.telefono}</span>
          <span>✉️ {contacto.email}</span>
        </div>
      )}
    </div>
  )
})

export default function ContactosBugueados() {
  const [contactos, setContactos]       = useState(CONTACTOS_INICIALES)
  const [busqueda, setBusqueda]         = useState('')
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [mostrarForm, setMostrarForm]   = useState(false)
  const [nuevoContacto, setNuevoContacto] = useState({ nombre: '', email: '', telefono: '' })

  useEffect(() => {
    const id = setInterval(() => {
      setTiempoSesion(tiempoSesion + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const contactosFiltrados = useMemo(() => {
    return contactos.filter(c =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.email.toLowerCase().includes(busqueda.toLowerCase())
    )
  }, [contactos])

  const handleEliminar = useCallback((id) => {
    setContactos(contactos.filter(c => c.id !== id))
  }, [])

  const handleToggleFavorito = (id) => {
    const contacto = contactos.find(c => c.id === id)
    contacto.favorito = !contacto.favorito
    setContactos([...contactos])
  }

  const handleAgregar = (e) => {
    e.preventDefault()
    if (!nuevoContacto.nombre.trim() || !nuevoContacto.email.trim()) return
    setContactos([...contactos, {
      id: Date.now(),
      ...nuevoContacto,
      favorito: false,
    }])
    setNuevoContacto({ nombre: '', email: '', telefono: '' })
    setMostrarForm(false)
  }

  const formatTiempo = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="contactos-app">
      <header className="contactos-header">
        <div className="contactos-header__titulo">
          <h1>Gestor de Contactos</h1>
          <p>Encontrá y corregí los errores de React Avanzado</p>
        </div>
        <div className="contactos-stats">
          <div className="stat-chip">👥 {contactos.length}</div>
          <div className="stat-chip stat-chip--gold">⭐ {contactos.filter(c => c.favorito).length}</div>
          <div className="stat-chip stat-chip--timer">⏱ {formatTiempo(tiempoSesion)}</div>
        </div>
      </header>

      <div className="contactos-controles">
        <input
          className="input-busqueda"
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button
          className="btn-toggle-form"
          onClick={() => setMostrarForm(f => !f)}
        >
          {mostrarForm ? '✕ Cancelar' : '+ Nuevo contacto'}
        </button>
      </div>

      {mostrarForm && (
        <form className="form-nuevo-contacto" onSubmit={handleAgregar}>
          <h2>Nuevo Contacto</h2>
          <div className="form-campos">
            <input
              type="text"
              placeholder="Nombre *"
              value={nuevoContacto.nombre}
              onChange={e => setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email *"
              value={nuevoContacto.email}
              onChange={e => setNuevoContacto({ ...nuevoContacto, email: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={nuevoContacto.telefono}
              onChange={e => setNuevoContacto({ ...nuevoContacto, telefono: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-guardar">Guardar contacto</button>
        </form>
      )}

      <div className="lista-contactos">
        {contactosFiltrados.length === 0 && (
          <div className="sin-resultados">
            <p>No se encontraron contactos.</p>
          </div>
        )}
        {contactosFiltrados.map((contacto, index) => (
          <TarjetaContacto
            key={index}
            contacto={contacto}
            onEliminar={handleEliminar}
            onToggleFavorito={handleToggleFavorito}
          />
        ))}
      </div>
    </div>
  )
}
