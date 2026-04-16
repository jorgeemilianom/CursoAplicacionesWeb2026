import PlayerStats from '../hud/PlayerStats'
import PlayerHand from '../hand/PlayerHand'
import SlotCard from './SlotCard'
import './Battle.css'

/**
 * PlayerZone - Zona completa de un jugador con soporte para Glassmorphism
 */
function PlayerZone({
  playerId,
  player,
  fieldCard,
  isCurrentTurn,
  selectedCardId,
  canPlay = false,
  showHand = false,
  onCardSelect,
  onCardDragStart,
  onPlayCard,
  onSlotClick,
  onSlotDrop
}) {
  const isPlayer1 = playerId === 'player1'

  return (
    <div
      className={`player-zone ${isPlayer1 ? 'player-zone--bottom' : 'player-zone--top'}`}
      data-active={isCurrentTurn}
    >
      <div className="player-zone__stats">
        <PlayerStats
          playerName={isPlayer1 ? 'Jugador 1' : 'Jugador 2'}
          hp={player.hp}
          shield={player.shield}
          handCount={player.hand?.length || 0}
          isCurrentTurn={isCurrentTurn}
        />
      </div>

      <div className="player-zone__slot">
        <SlotCard
          card={fieldCard}
          playerId={playerId}
          onClick={() => onSlotClick?.(playerId)}
          onDropCard={onSlotDrop}
          isActive={canPlay && !fieldCard}
          canDrop={canPlay && !fieldCard}
        />
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
