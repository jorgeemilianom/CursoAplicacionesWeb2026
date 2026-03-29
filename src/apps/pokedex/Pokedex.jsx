import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Pokedex.css'

/*
  Estados posibles de la búsqueda:
  'idle'     → pantalla inicial, sin búsqueda aún
  'cargando' → fetch en curso
  'error'    → pokémon no encontrado o falla de red
  'exito'    → datos recibidos correctamente
*/

const TIPO_COLORES = {
  fire:     { bg: '#fff0e6', color: '#c2410c', borde: '#fdba74' },
  water:    { bg: '#eff6ff', color: '#1d4ed8', borde: '#93c5fd' },
  grass:    { bg: '#f0fdf4', color: '#15803d', borde: '#86efac' },
  electric: { bg: '#fefce8', color: '#92400e', borde: '#fde68a' },
  psychic:  { bg: '#fdf2f8', color: '#9d174d', borde: '#f9a8d4' },
  ice:      { bg: '#ecfeff', color: '#0e7490', borde: '#67e8f9' },
  dragon:   { bg: '#eff6ff', color: '#1e40af', borde: '#bfdbfe' },
  dark:     { bg: '#1f2937', color: '#f9fafb', borde: '#374151' },
  fighting: { bg: '#fff1f2', color: '#be123c', borde: '#fda4af' },
  poison:   { bg: '#fdf4ff', color: '#7e22ce', borde: '#d8b4fe' },
  ground:   { bg: '#fef9ee', color: '#92400e', borde: '#fcd34d' },
  flying:   { bg: '#f0f9ff', color: '#0369a1', borde: '#7dd3fc' },
  bug:      { bg: '#f7fee7', color: '#3f6212', borde: '#bef264' },
  rock:     { bg: '#f5f5f4', color: '#44403c', borde: '#a8a29e' },
  ghost:    { bg: '#faf5ff', color: '#6b21a8', borde: '#c084fc' },
  steel:    { bg: '#f1f5f9', color: '#334155', borde: '#94a3b8' },
  fairy:    { bg: '#fdf2f8', color: '#be185d', borde: '#f9a8d4' },
  normal:   { bg: '#fafafa', color: '#525252', borde: '#d4d4d4' },
}

const STAT_LABELS = {
  hp:              'HP',
  attack:          'Ataque',
  defense:         'Defensa',
  'special-attack': 'Sp. Ataque',
  'special-defense':'Sp. Defensa',
  speed:           'Velocidad',
}

function Pokedex() {
  const [busqueda, setBusqueda]     = useState('')
  const [estado, setEstado]         = useState('idle')   // 'idle' | 'cargando' | 'error' | 'exito'
  const [pokemon, setPokemon]       = useState(null)
  const [historial, setHistorial]   = useState([])       // últimas 5 búsquedas exitosas

  // ── FETCH ─────────────────────────────────────────────
  const buscar = async (nombreOId) => {
    const termino = (nombreOId ?? busqueda).trim().toLowerCase()
    if (!termino) return

    setEstado('cargando')
    setPokemon(null)

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${termino}`)

      if (!res.ok) {
        // 404 u otro error HTTP
        setEstado('error')
        return
      }

      const data = await res.json()

      setPokemon(data)
      setEstado('exito')

      // Actualizamos el historial (sin duplicados, máx 5)
      setHistorial(prev => {
        const sinDuplicado = prev.filter(n => n !== data.name)
        return [data.name, ...sinDuplicado].slice(0, 5)
      })
    } catch {
      // Error de red (sin conexión, etc.)
      setEstado('error')
    }
  }

  const manejarEnter = (e) => {
    if (e.key === 'Enter') buscar()
  }

  // ── DATOS DERIVADOS (cuando hay un pokémon cargado) ───
  const sprite   = pokemon?.sprites?.other?.['official-artwork']?.front_default
                ?? pokemon?.sprites?.front_default
  const numero   = pokemon ? String(pokemon.id).padStart(3, '0') : null
  const tipos    = pokemon?.types?.map(t => t.type.name) ?? []
  const stats    = pokemon?.stats ?? []
  const altura   = pokemon ? (pokemon.height / 10).toFixed(1) : null  // en metros
  const peso     = pokemon ? (pokemon.weight / 10).toFixed(1) : null  // en kg

  return (
    <div className="pokedex">
      <div className="pokedex__container">

        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="app-header">
          <span className="app-modulo">Módulo 04 — JavaScript Avanzado</span>
          <h1>Pokédex</h1>
          <p>
            Buscá cualquier pokémon por nombre o número. Practica <code>fetch</code>,{' '}
            <code>async/await</code> y el manejo de estados de carga.
          </p>
        </header>

        {/* ── BUSCADOR ── */}
        <div className="pokedex__buscador">
          <input
            type="text"
            className="pokedex__input"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            onKeyDown={manejarEnter}
            placeholder="Nombre o número... ej: pikachu, 25"
          />
          <button
            className="pokedex__btn-buscar"
            onClick={() => buscar()}
            disabled={estado === 'cargando'}
          >
            {estado === 'cargando' ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {/* ── HISTORIAL ── */}
        {historial.length > 0 && (
          <div className="pokedex__historial">
            <span className="pokedex__historial-label">Recientes:</span>
            {historial.map(nombre => (
              <button
                key={nombre}
                className="pokedex__historial-btn"
                onClick={() => {
                  setBusqueda(nombre)
                  buscar(nombre)
                }}
              >
                {nombre}
              </button>
            ))}
          </div>
        )}

        {/* ── ESTADOS ── */}

        {estado === 'idle' && (
          <div className="pokedex__idle">
            <span className="pokedex__idle-emoji">⚡</span>
            <p>Ingresá el nombre o número de un pokémon para comenzar.</p>
          </div>
        )}

        {estado === 'cargando' && (
          <div className="pokedex__cargando">
            <div className="pokedex__spinner" />
            <p>Consultando la PokéAPI...</p>
          </div>
        )}

        {estado === 'error' && (
          <div className="pokedex__error">
            <span className="pokedex__error-emoji">❌</span>
            <h2>Pokémon no encontrado</h2>
            <p>
              Revisá que el nombre o número sea correcto.<br />
              Ejemplo: <strong>pikachu</strong>, <strong>bulbasaur</strong>, <strong>25</strong>
            </p>
          </div>
        )}

        {estado === 'exito' && pokemon && (
          <div className="pokedex__card">

            {/* Encabezado */}
            <div className="pokedex__card-header">
              <img
                src={sprite}
                alt={pokemon.name}
                className="pokedex__sprite"
              />
              <div className="pokedex__card-info">
                <span className="pokedex__numero">#{numero}</span>
                <h2 className="pokedex__nombre">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h2>
                <div className="pokedex__tipos">
                  {tipos.map(tipo => {
                    const estilo = TIPO_COLORES[tipo] ?? TIPO_COLORES.normal
                    return (
                      <span
                        key={tipo}
                        className="pokedex__tipo"
                        style={{ background: estilo.bg, color: estilo.color, borderColor: estilo.borde }}
                      >
                        {tipo}
                      </span>
                    )
                  })}
                </div>
                <div className="pokedex__medidas">
                  <span>Altura: <strong>{altura} m</strong></span>
                  <span>Peso: <strong>{peso} kg</strong></span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="pokedex__stats">
              <h3 className="pokedex__stats-titulo">Estadísticas base</h3>
              {stats.map(s => {
                const label = STAT_LABELS[s.stat.name] ?? s.stat.name
                const porcentaje = Math.min((s.base_stat / 255) * 100, 100)
                return (
                  <div key={s.stat.name} className="pokedex__stat-fila">
                    <span className="pokedex__stat-nombre">{label}</span>
                    <span className="pokedex__stat-valor">{s.base_stat}</span>
                    <div className="pokedex__stat-barra">
                      <div
                        className="pokedex__stat-barra-relleno"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── CONCEPTOS ── */}
        <div className="app-conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <code>fetch</code>
              <span>Hacer una solicitud HTTP a la PokéAPI para obtener datos reales</span>
            </li>
            <li>
              <code>async / await</code>
              <span>Escribir código asincrónico de forma legible, sin callbacks anidados</span>
            </li>
            <li>
              <code>res.ok / res.json()</code>
              <span>Verificar que la respuesta fue exitosa y convertir el JSON a objeto JS</span>
            </li>
            <li>
              <code>try / catch</code>
              <span>Capturar errores de red o respuestas inválidas sin romper la app</span>
            </li>
            <li>
              <span className="tag-neutro">Estados UI</span>
              <span>Manejar idle, cargando, error y éxito como estados explícitos en el componente</span>
            </li>
            <li>
              <code>useState</code>
              <span>Múltiples estados que colaboran para reflejar el ciclo de vida de una petición</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Pokedex
