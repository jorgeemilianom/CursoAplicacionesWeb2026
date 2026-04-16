import { useGame } from '../context/GameContext'
import { useBattle } from '../context/BattleContext'
import './Screens.css'

/**
 * ResultScreen - Pantalla de resultado al finalizar la partida
 */
function ResultScreen() {
  const { winner, player1HP, player2HP, resetGame, startGame } = useGame()
  const { resetBattle, startBattle } = useBattle()

  const isDraw = winner === 'draw'
  const winnerName = winner === 'player1' ? 'Jugador 1' : 'Jugador 2'
  const winnerEmoji = winner === 'player1' ? '🏆' : winner === 'player2' ? '👑' : '🤝'

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
          {isDraw ? '¡Empate!' : '¡Victoria!'}
        </h1>

        <p className="result-screen__winner">
          {isDraw ? 'La batalla termino sin un ganador' : `${winnerName} ha ganado la batalla`}
        </p>

        <div className="result-screen__stats">
          <div className={`result-screen__stat ${isDraw ? '' : 'result-screen__stat--winner'}`}>
            <span className="result-screen__stat-label">{isDraw ? 'Jugador 1' : winnerName}</span>
            <span className="result-screen__stat-value">
              {isDraw ? player1HP : winner === 'player1' ? player1HP : player2HP} HP
            </span>
            <span className="result-screen__stat-badge">{isDraw ? 'EMPATE' : 'GANADOR'}</span>
          </div>

          <div className="result-screen__vs">VS</div>

          <div className={`result-screen__stat ${isDraw ? '' : 'result-screen__stat--loser'}`}>
            <span className="result-screen__stat-label">
              {isDraw ? 'Jugador 2' : winner === 'player1' ? 'Jugador 2' : 'Jugador 1'}
            </span>
            <span className="result-screen__stat-value">
              {isDraw ? player2HP : winner === 'player1' ? player2HP : player1HP} HP
            </span>
            <span className="result-screen__stat-badge">{isDraw ? 'EMPATE' : 'DERROTADO'}</span>
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
