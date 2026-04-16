import { useGame } from '../context/GameContext'
import { useBattle } from '../context/BattleContext'
import './Screens.css'

/**
 * ResultScreen - Pantalla de resultado al finalizar la partida
 */
function ResultScreen() {
  const { winner, player1HP, player2HP, resetGame, startGame } = useGame()
  const { resetBattle, startBattle } = useBattle()

  const winnerName = winner === 'player1' ? 'Jugador 1' : 'Jugador 2'
  const winnerEmoji = winner === 'player1' ? '🏆' : '👑'

  const handleNewGame = () => {
    resetBattle()
    startGame()
    startBattle()
  }

  const handleBackToMenu = () => {
    resetBattle()
    resetGame()
  }

  return (
    <div className="result-screen">
      <div className="result-screen__content">
        <div className="result-screen__trophy">
          {winnerEmoji}
        </div>

        <h1 className="result-screen__title">
          ¡Victoria!
        </h1>

        <p className="result-screen__winner">
          {winnerName} ha ganado la batalla
        </p>

        <div className="result-screen__stats">
          <div className="result-screen__stat result-screen__stat--winner">
            <span className="result-screen__stat-label">{winnerName}</span>
            <span className="result-screen__stat-value">
              {winner === 'player1' ? player1HP : player2HP} HP
            </span>
            <span className="result-screen__stat-badge">GANADOR</span>
          </div>

          <div className="result-screen__vs">VS</div>

          <div className="result-screen__stat result-screen__stat--loser">
            <span className="result-screen__stat-label">
              {winner === 'player1' ? 'Jugador 2' : 'Jugador 1'}
            </span>
            <span className="result-screen__stat-value">
              {winner === 'player1' ? player2HP : player1HP} HP
            </span>
            <span className="result-screen__stat-badge">DERROTADO</span>
          </div>
        </div>

        <div className="result-screen__actions">
          <button className="result-screen__btn result-screen__btn--primary" onClick={handleNewGame}>
            🔄 Nueva Partida
          </button>
          <button className="result-screen__btn result-screen__btn--secondary" onClick={handleBackToMenu}>
            🏠 Volver al Menú
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultScreen
