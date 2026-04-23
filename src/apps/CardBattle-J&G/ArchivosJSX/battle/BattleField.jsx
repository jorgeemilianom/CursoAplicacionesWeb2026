import SlotCard from './SlotCard'
import PlayerStats from '../hud/PlayerStats'
import './Battle.css'

function BattleField({
  player1Card,
  player2Card,
  player1Data,
  player2Data,
  player1Name = 'Jugador 1',
  player2Name = 'Jugador 2',
  player1Active,
  player2Active,
  onResolve,
  canResolve,
  onSlotClick,
  onSlotDrop,
  canPlayP1 = false
}) {
  return (
    <div className="battle-field">
      <div className="battle-field__column battle-field__column--left">
        <div className="battle-field__slot">
          <SlotCard
            card={player2Card}
            playerId="player2"
            compact
          />
        </div>

        <div className="battle-field__stats battle-field__stats--left">
          <PlayerStats
            playerName={`${player2Name} (bot)`}
            hp={player2Data?.hp ?? 20}
            shield={player2Data?.shield ?? 0}
            handCount={player2Data?.hand?.length ?? 0}
            isCurrentTurn={player2Active}
            compact
          />
        </div>
      </div>

      <div className="battle-field__vs">
        <span className="battle-field__vs-text">VS</span>
        <button
          className="battle-field__resolve-btn"
          onClick={onResolve}
          disabled={!canResolve}
        >
          Combatir
        </button>
      </div>

      <div className="battle-field__column battle-field__column--right">
        <div className="battle-field__stats battle-field__stats--right">
          <PlayerStats
            playerName={`${player1Name} (tu)`}
            hp={player1Data?.hp ?? 20}
            shield={player1Data?.shield ?? 0}
            handCount={player1Data?.hand?.length ?? 0}
            isCurrentTurn={player1Active}
            compact
          />
        </div>

        <div className="battle-field__slot">
          <SlotCard
            card={player1Card}
            playerId="player1"
            onClick={() => onSlotClick?.('player1')}
            onDropCard={onSlotDrop}
            isActive={canPlayP1 && !player1Card}
            canDrop={canPlayP1 && !player1Card}
            compact
          />
        </div>
      </div>
    </div>
  )
}

export default BattleField
