import PlayerStats from '../hud/PlayerStats'
import PlayerHand from '../hand/PlayerHand'
import './Battle.css'

/**
 * PlayerZone - Zona completa de un jugador con soporte para Glassmorphism
 */
function PlayerZone({
  playerId,
  player,
  isCurrentTurn,
  selectedCardId,
  canPlay = false,
  showHand = false,
  onCardSelect,
  onCardDragStart,
  onPlayCard
}) {
  const isPlayer1 = playerId === 'player1'

  return (
    <div
      className={`player-zone ${isPlayer1 ? 'player-zone--bottom' : 'player-zone--top'} ${showHand ? 'player-zone--with-hand' : 'player-zone--compact'}`}
      data-active={isCurrentTurn}
    >
      <div className="player-zone__main-row">
        <div className="player-zone__stats">
          <PlayerStats
            playerName={isPlayer1 ? 'Jugador 1' : 'Jugador 2'}
            hp={player.hp}
            shield={player.shield}
            handCount={player.hand?.length || 0}
            isCurrentTurn={isCurrentTurn}
          />
        </div>
      </div>

      {showHand && (
        <div className="player-zone__hand">
          <PlayerHand
            hand={player.hand}
            playerId={playerId}
            onCardClick={onCardSelect}
            onCardDragStart={onCardDragStart}
            onPlayCard={onPlayCard}
            selectedCardId={selectedCardId}
            canPlay={canPlay}
          />
        </div>
      )}
    </div>
  )
}

export default PlayerZone
