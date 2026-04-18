import './HUD.css'

function TurnIndicator({ currentTurn, turnPhase }) {
  const phaseLabel = {
    draw: 'Robar',
    play: 'Jugar',
    resolve: 'Resolver',
    gameover: 'Finalizado'
  }

  return (
    <div className="turn-indicator">
      <div className={`turn-indicator__arrow ${currentTurn === 'player1' ? 'turn-indicator__arrow--left' : 'turn-indicator__arrow--right'}`}>
        {'>'}
      </div>
      <span className="turn-indicator__text">
        Turno de {currentTurn === 'player1' ? 'Jugador 1' : 'Jugador 2'} - {phaseLabel[turnPhase] ?? turnPhase}
      </span>
    </div>
  )
}

export default TurnIndicator
