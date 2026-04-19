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
          Enfrenta tus cartas y gana la batalla
        </p>

        <input
          type="text"
          placeholder="Tu nombre..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="menu-screen__input"
        />

        <div className="menu-screen__rules">
          <h3>📜 Reglas del juego</h3>
          <ul>
            <li>Arrastrá cartas al campo de batalla</li>
            <li>El ataque se resuelve al presionar "Combatir"</li>
            <li>El primero en quedarse sin vida pierde</li>
          </ul>
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