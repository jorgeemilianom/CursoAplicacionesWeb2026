import HealthBar from './HealthBar'
import './HUD.css'

/**
 * PlayerStats - Panel de estadísticas de un jugador
 * @param {string} playerName - Nombre del jugador
 * @param {number} hp - Puntos de vida
 * @param {number} shield - Puntos de escudo
 * @param {number} handCount - Cantidad de cartas en mano
 * @param {boolean} isCurrentTurn - Si es su turno
 */
function PlayerStats({ playerName, hp, shield = 0, handCount = 0, isCurrentTurn = false }) {
  return (
    <div className={`player-stats ${isCurrentTurn ? 'player-stats--active' : ''}`}>
      <div className="player-stats__header">
        <span className="player-stats__name">{playerName}</span>
        {isCurrentTurn && <span className="player-stats__turn-badge">TU TURNO</span>}
      </div>

      <HealthBar current={hp} max={20} />

      <div className="player-stats__extras">
        {shield > 0 && (
          <div className="player-stats__shield">
            <span className="shield-icon">🛡️</span>
            <span className="shield-value">{shield}</span>
          </div>
        )}
        <div className="player-stats__hand">
          <span className="hand-icon">🃏</span>
          <span className="hand-value">{handCount}</span>
        </div>
      </div>
    </div>
  )
}

export default PlayerStats