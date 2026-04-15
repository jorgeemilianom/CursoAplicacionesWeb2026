import './Card.css'

/**
 * CardEffect - Muestra una animación de efecto al jugar una carta
 * @param {Object} effect - { card, message, type }
 */
function CardEffect({ effect }) {
  if (!effect) return null

  const { card, message } = effect

  const effectColors = {
    damage: '#ff6b6b',
    heal: '#4ecdc4',
    shield: '#45b7d1',
    draw: '#9b59b6'
  }

  const color = effectColors[card.effectType] || '#fff'

  return (
    <div className="card-effect" style={{ '--effect-color': color }}>
      <div className="card-effect__content">
        <div className="card-effect__icon">
          {card.effectType === 'damage' && '⚔️'}
          {card.effectType === 'heal' && '💚'}
          {card.effectType === 'shield' && '🛡️'}
          {card.effectType === 'draw' && '📚'}
        </div>
        <div className="card-effect__card-name">{card.name}</div>
        <div className="card-effect__message">{message}</div>
      </div>
    </div>
  )
}

export default CardEffect