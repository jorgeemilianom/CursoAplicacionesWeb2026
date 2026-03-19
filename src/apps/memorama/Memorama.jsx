import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Memorama.css'

const EMOJIS = ['🌍', '🚀', '💻', '🎯', '⚡', '🔥', '🎨', '🧩']

function crearBaraja() {
  return [...EMOJIS, ...EMOJIS]
    .map((emoji, i) => ({ id: i, emoji, volteada: false, encontrada: false }))
    .sort(() => Math.random() - 0.5)
}

function Memorama() {
  const [cartas, setCartas] = useState(crearBaraja)
  const [volteadas, setVolteadas] = useState([]) // ids de las cartas actualmente boca arriba
  const [intentos, setIntentos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)

  const paresEncontrados = cartas.filter(c => c.encontrada).length / 2
  const ganado = paresEncontrados === EMOJIS.length

  const reiniciar = () => {
    setCartas(crearBaraja())
    setVolteadas([])
    setIntentos(0)
    setBloqueado(false)
  }

  const voltearCarta = (id) => {
    if (bloqueado) return
    if (volteadas.includes(id)) return

    const carta = cartas.find(c => c.id === id)
    if (!carta || carta.encontrada) return

    // Actualizamos el estado local (no el de React todavía) para poder comparar
    const nuevasCartas = cartas.map(c => c.id === id ? { ...c, volteada: true } : c)
    const nuevasVolteadas = [...volteadas, id]

    setCartas(nuevasCartas)
    setVolteadas(nuevasVolteadas)

    // Si hay 2 cartas volteadas, verificamos si hacen par
    if (nuevasVolteadas.length === 2) {
      setBloqueado(true)
      setIntentos(i => i + 1)

      const [id1, id2] = nuevasVolteadas
      const c1 = nuevasCartas.find(c => c.id === id1)
      const c2 = nuevasCartas.find(c => c.id === id2)

      if (c1.emoji === c2.emoji) {
        // ¡Par encontrado! Las marcamos como encontradas
        setCartas(nuevasCartas.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, encontrada: true } : c
        ))
        setVolteadas([])
        setBloqueado(false)
      } else {
        // No coinciden: esperamos y las damos vuelta de nuevo
        setTimeout(() => {
          setCartas(prev => prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, volteada: false } : c
          ))
          setVolteadas([])
          setBloqueado(false)
        }, 900)
      }
    }
  }

  return (
    <div className="memorama">
      <div className="memorama__container">

        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="app-header">
          <span className="app-modulo">Módulo 05 — React.js</span>
          <h1>Memorama</h1>
          <p>Encontrá los 8 pares de cartas. ¡La menor cantidad de intentos, mejor!</p>
        </header>

        <div className="memorama__stats">
          <div className="memorama__stat">
            <strong>{intentos}</strong>
            <span>Intentos</span>
          </div>
          <div className="memorama__stat">
            <strong>{paresEncontrados} / {EMOJIS.length}</strong>
            <span>Pares</span>
          </div>
          <div className="memorama__stat">
            <strong>{EMOJIS.length - paresEncontrados}</strong>
            <span>Restantes</span>
          </div>
        </div>

        {ganado && (
          <div className="memorama__victoria">
            <span className="memorama__victoria-emoji">🎉</span>
            <h2>¡Ganaste en {intentos} intentos!</h2>
            <button onClick={reiniciar} className="memorama__btn-reiniciar memorama__btn-reiniciar--victoria">
              Jugar de nuevo
            </button>
          </div>
        )}

        <div className={`memorama__grilla ${ganado ? 'memorama__grilla--opaca' : ''}`}>
          {cartas.map(carta => (
            <button
              key={carta.id}
              className={`carta ${carta.volteada || carta.encontrada ? 'carta--volteada' : ''} ${carta.encontrada ? 'carta--encontrada' : ''}`}
              onClick={() => voltearCarta(carta.id)}
              disabled={carta.encontrada || bloqueado}
              aria-label={carta.volteada ? carta.emoji : 'Carta boca abajo'}
            >
              <div className="carta__inner">
                <div className="carta__frente">?</div>
                <div className="carta__dorso">{carta.emoji}</div>
              </div>
            </button>
          ))}
        </div>

        {!ganado && (
          <button className="memorama__btn-reiniciar" onClick={reiniciar}>
            Reiniciar juego
          </button>
        )}

        <div className="app-conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <code>useState</code>
              <span>Estado del tablero, contador de intentos y cartas volteadas</span>
            </li>
            <li>
              <code>Array.sort(() =&gt; Math.random() - 0.5)</code>
              <span>Mezclar las cartas al azar en cada partida</span>
            </li>
            <li>
              <code>Array.map()</code>
              <span>Actualizar una sola carta sin mutar el array original</span>
            </li>
            <li>
              <code>setTimeout</code>
              <span>Esperar antes de dar vuelta las cartas que no hicieron par</span>
            </li>
            <li>
              <span className="tag-neutro">CSS 3D flip</span>
              <span>Animación de volteo con transform-style y backface-visibility</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default Memorama
