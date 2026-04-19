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

      {/* PLAYER 2 (arriba) */}
      <div className="battle-field__zone battle-field__zone--player2">
        {player2Card && (
          <SlotCard
            card={player2Card}
            playerId="player2"
          />
        )}
      </div>

      {/* VS CENTRO */}
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

      {/* PLAYER 1 (abajo) */}
      <div className="battle-field__zone battle-field__zone--player1">
        {player1Card && (
          <SlotCard
            card={player1Card}
            playerId="player1"
          />
        )}
      </div>

    </div>
  )
}

export default BattleField