import Card from '../card/Card'
import './Battle.css'

/**
 * SlotCard - Un slot donde colocar una carta en el campo de batalla
 * @param {Object} card - Carta colocada en el slot (null si está vacío)
 * @param {string} playerId - 'player1' | 'player2'
 * @param {function} onClick - Callback al hacer click
 * @param {boolean} isActive - Si el slot está activo
 */
function SlotCard({ card, playerId, onClick, isActive = false }) {
  return (
    <div
      className={`slot-card ${card ? 'slot-card--filled' : 'slot-card--empty'} ${isActive ? 'slot-card--active' : ''}`}
      onClick={onClick}
    >
      {card ? (
        <Card card={card} size="large" clickable={false} />
      ) : (
        <div className="slot-card__placeholder">
          <span className="slot-card__icon">+</span>
          <span className="slot-card__text">
            {playerId === 'player1' ? 'Tu slot' : 'Oponente'}
          </span>
        </div>
      )}
    </div>
  )
}

export default SlotCard