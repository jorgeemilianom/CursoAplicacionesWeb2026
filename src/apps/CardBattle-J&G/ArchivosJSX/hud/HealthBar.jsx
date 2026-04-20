import './HUD.css'

/**
 * HealthBar - Barra de vida con animación
 * @param {number} current - Vida actual
 * @param {number} max - Vida máxima (default 20)
 * @param {string} label - Etiqueta del jugador
 * @param {boolean} compact - Modo compacto para la banda de BattleField
 */
function HealthBar({ current, max = 20, label, compact = false }) {
  const percentage = (current / max) * 100

  // Color según nivel de vida
  const getHealthColor = () => {
    if (percentage > 60) return '#4ecdc4' // Verde
    if (percentage > 30) return '#f9ca24' // Amarillo
    return '#ff6b6b' // Rojo
  }

  return (
    <div className={`health-bar ${compact ? 'health-bar--compact' : ''}`}>
      {label && <span className="health-bar__label">{label}</span>}
      <div className="health-bar__container">
        <div
          className="health-bar__fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: getHealthColor()
          }}
        />
      </div>
      <span className="health-bar__value">{current}/{max}</span>
    </div>
  )
}

export default HealthBar