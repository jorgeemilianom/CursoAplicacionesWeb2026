import HealthBar from './HealthBar'
import './HUD.css'

function PlayerStats({
  playerName,
  hp,
  shield = 0,
  handCount = 0,
  isCurrentTurn = false,
  compact = false
}) {
  const className = `player-stats ${isCurrentTurn ? 'player-stats--active' : ''} ${compact ? 'player-stats--compact' : ''}`.trim()
  const turnLabel = playerName === 'Jugador 1' ? 'TU TURNO' : 'EN TURNO'

  return (
    <div className={className}>
      <div className="player-stats__header">
        <span className="player-stats__name">{playerName}</span>
        {isCurrentTurn && !compact && <span className="player-stats__turn-badge">{turnLabel}</span>}
      </div>

      <HealthBar current={hp} max={20} compact={compact} />

      <div className="player-stats__extras">
        {shield > 0 && (
          <div className="player-stats__shield">
            <span className="player-stats__shield-icon">S</span>
            <span className="player-stats__shield-value">{shield}</span>
          </div>
        )}

        {!compact && (
          <div className="player-stats__hand">
            <span className="player-stats__hand-icon">H</span>
            <span className="player-stats__hand-value">{handCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerStats
