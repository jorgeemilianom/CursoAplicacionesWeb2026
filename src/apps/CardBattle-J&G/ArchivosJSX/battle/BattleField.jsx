import SlotCard from './SlotCard'
import './Battle.css'

/**
 * BattleField - El campo central de batalla donde se enfrentan las cartas
 * @param {Object} player1Card - Carta del jugador 1 en el campo
 * @param {Object} player2Card - Carta del jugador 2 en el campo
 * @param {function} onResolve - Callback para resolver el combate
 * @param {boolean} canResolve - Si se puede resolver el combate
 */
function BattleField({ player1Card, player2Card, onResolve, canResolve }) {
  return (
    <div className="battle-field">
      <div className="battle-field__zone battle-field__zone--player2">
        <SlotCard
          card={player2Card}
          playerId="player2"
        />
      </div>

      <div className="battle-field__vs">
        <span className="battle-field__vs-text">VS</span>
        {canResolve && (
          <button
            className="battle-field__resolve-btn"
            onClick={onResolve}
          >
            ¡Combatir!
          </button>
        )}
      </div>

      <div className="battle-field__zone battle-field__zone--player1">
        <SlotCard
          card={player1Card}
          playerId="player1"
        />
      </div>
    </div>
  )
}

export default BattleField