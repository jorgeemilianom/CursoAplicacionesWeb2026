import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { useBattle } from '../context/BattleContext'

function MenuScreen() {
  const { startGame } = useGame()
  const { startBattle, resetBattle } = useBattle()

  const [name, setName] = useState('')

  const handleStart = () => {
    resetBattle()
    startGame()
    startBattle()
  }

  return (
    <div className="menu-screen">
      <div className="menu-screen__content">
        <h1 className="menu-screen__title">
          <span className="menu-screen__title-icon">⚔️</span>
          Card Battle
        </h1>

        <p className="menu-screen__subtitle">
          Aprende rapido, juega una carta por turno y gana la batalla bajando la vida rival a 0.
        </p>

        <input
          type="text"
          placeholder="Tu nombre..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="menu-screen__input"
        />

        <div className="menu-screen__rules">
          <h3>Guia rapida para tu primera partida</h3>

          <div className="menu-screen__guide-grid">
            <section className="menu-screen__guide-card">
              <h4>1. Que objetivo tienes</h4>
              <p>Empiezas con 20 de vida. Gana quien deje al rival en 0 primero o quien termine con mas vida si se acaba el mazo.</p>
            </section>

            <section className="menu-screen__guide-card">
              <h4>2. Como va un turno</h4>
              <ul>
                <li>Robas 1 carta.</li>
                <li>Juegas 1 carta al campo.</li>
                <li>Cuando ambos tienen carta, se resuelve el combate.</li>
              </ul>
            </section>

            <section className="menu-screen__guide-card">
              <h4>3. Que significan los valores</h4>
              <ul>
                <li><strong>ATK</strong>: cuanto dano puede hacer tu carta.</li>
                <li><strong>DEF</strong>: cuanto dano bloquea frente a la carta enemiga.</li>
                <li><strong>Efecto</strong>: bono extra que se activa al resolver el combate.</li>
              </ul>
            </section>

            <section className="menu-screen__guide-card">
              <h4>4. Como se calcula el dano</h4>
              <p>Primero se compara <strong>ataque</strong> contra <strong>defensa</strong>. La formula base es simple: <strong>dano = ATK rival - DEF propia</strong>, sin bajar de 0.</p>
            </section>

            <section className="menu-screen__guide-card">
              <h4>5. Que hace cada tipo de carta</h4>
              <ul>
                <li><strong>Damage</strong>: mete dano extra directo.</li>
                <li><strong>Heal</strong>: recupera vida.</li>
                <li><strong>Shield</strong>: guarda escudo para bloquear dano futuro.</li>
                <li><strong>Draw</strong>: te hace robar mas cartas.</li>
              </ul>
            </section>

            <section className="menu-screen__guide-card">
              <h4>6. Como leer quien gana a quien</h4>
              <p>Las cartas con mucho <strong>ATK</strong> castigan defensas bajas. Las de mucha <strong>DEF</strong> frenan atacantes. Las de <strong>heal</strong> o <strong>shield</strong> sirven para aguantar. Las de <strong>draw</strong> te dan mas opciones.</p>
            </section>
          </div>

          <div className="menu-screen__tips">
            <h4>Consejos utiles</h4>
            <ul>
              <li>Si tu rival juega agresivo, una carta con buena defensa o escudo puede darte vuelta el duelo.</li>
              <li>No siempre gana la carta mas fuerte: a veces curarte o robar vale mas que pegar.</li>
              <li>Si ambos se quedan sin cartas, importa quien conserve mas vida.</li>
            </ul>
          </div>
        </div>

        <button
          className="menu-screen__start-btn"
          onClick={handleStart}
        >
          Comenzar batalla
        </button>
      </div>
    </div>
  )
}

export default MenuScreen
