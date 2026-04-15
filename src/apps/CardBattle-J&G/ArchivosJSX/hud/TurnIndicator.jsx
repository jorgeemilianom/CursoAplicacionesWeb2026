import './HUD.css'

/**
 * TurnIndicator - Muestra de quién es el turno actual
 * @param {string} currentTurn - 'player1' | 'player2'
 */
function TurnIndicator({ currentTurn }) {
  return (
    <div className="turn-indicator">
      <div className={`turn-indicator__arrow ${currentTurn === 'player1' ? 'turn-indicator__arrow--left' : 'turn-indicator__arrow--right'}`}>
        ▶
      </div>
      <span className="turn-indicator__text">
        Turno de {currentTurn === 'player1' ? 'Jugador 1' : 'Jugador 2'}
      </span>
    </div>
  )
}

export default TurnIndicator