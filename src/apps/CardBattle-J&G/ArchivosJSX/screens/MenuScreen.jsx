import { useGame } from '../context/GameContext'
import { useBattle } from '../context/BattleContext'
import './Screens.css'

/**
 * MenuScreen - Pantalla de inicio del juego
 */
function MenuScreen() {
  const { startGame } = useGame()
  const { resetBattle, startBattle } = useBattle()

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
          <span className="menu-screen__title-icon">🛡️</span>
        </h1>
        <p className="menu-screen__subtitle">Juego de Cartas - Duelo entre Jugadores</p>

        <div className="menu-screen__rules">
          <h3>Cómo jugar:</h3>
          <ul>
            <li>Cada jugador comienza con <strong>20 puntos de vida</strong></li>
            <li>En tu turno, selecciona una carta de tu mano</li>
            <li>Haz click en tu slot para colocar la carta</li>
            <li>Cuando ambos tienen carta, ¡combate!</li>
            <li>El objetivo: reducir la vida del oponente a 0</li>
          </ul>
        </div>

        <button className="menu-screen__start-btn" onClick={handleStart}>
          ¡Comenzar Batalla!
        </button>

        <div className="menu-screen__credits">
          <span>Jugador 1 vs Jugador 2</span>
          <span>•</span>
          <span>Mazo compartido</span>
        </div>
      </div>
    </div>
  )
}

export default MenuScreen
