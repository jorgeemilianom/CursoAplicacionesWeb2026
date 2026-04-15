import PlayerStats from '../hud/PlayerStats'
import PlayerHand from '../hand/PlayerHand'
import SlotCard from './SlotCard'
import './Battle.css'

/**
 * PlayerZone - Zona completa de un jugador
 * @param {string} playerId - 'player1' | 'player2'
 * @param {Object} player - Datos del jugador { hp, shield, hand }
 * @param {Object} fieldCard - Carta en el campo
 * @param {boolean} isCurrentTurn - Si es su turno
 * @param {string} selectedCardId - Carta seleccionada en mano
 * @param {function} onCardSelect - Callback al seleccionar carta
 * @param {function} onSlotClick - Callback al hacer click en slot
 */
function PlayerZone({
  playerId,
  player,
  fieldCard,
  isCurrentTurn,
  selectedCardId,
  onCardSelect,
  onSlotClick
}) {
  const isPlayer1 = playerId === 'player1'

  return (
    <div className={`player-zone ${isPlayer1 ? 'player-zone--bottom' : 'player-zone--top'}`}>
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
          isActive={isCurrentTurn && !fieldCard}
        />
      </div>

      {isPlayer1 && (
        <div className="player-zone__hand">
          <PlayerHand
            hand={player.hand}
            onCardClick={onCardSelect}
            selectedCardId={selectedCardId}
            canPlay={isCurrentTurn}
          />
        </div>
      )}
    </div>
  )
}

export default PlayerZone