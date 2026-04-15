import './Card.css'

/**
 * CardFront - Muestra el frente de una carta con sus estadísticas
 * @param {Object} card - Datos de la carta (name, attack, defense, effectType, effectValue, description, rarity)
 */
function CardFront({ card }) {
  if (!card) return null

  const rarityClass = `card--${card.rarity}`
  const effectIcon = {
    damage: '⚔️',
    heal: '💚',
    shield: '🛡️',
    draw: '📚'
  }

  return (
    <div className={`card-front ${rarityClass}`}>
      <div className="card-front__header">
        <span className="card-front__rarity">
          {card.rarity === 'legendary' ? '⭐' : card.rarity === 'rare' ? '◆' : '○'}
        </span>
        <h3 className="card-front__name">{card.name}</h3>
      </div>

      <div className="card-front__image">
        <span className="card-front__effect-icon">
          {effectIcon[card.effectType]}
        </span>
      </div>

      <div className="card-front__stats">
        <div className="card-front__stat card-front__stat--attack">
          <span className="stat-icon">⚔️</span>
          <span className="stat-value">{card.attack}</span>
        </div>
        <div className="card-front__stat card-front__stat--defense">
          <span className="stat-icon">🛡️</span>
          <span className="stat-value">{card.defense}</span>
        </div>
      </div>

      <div className="card-front__effect">
        <span className="effect-badge">
          +{card.effectValue} {effectIcon[card.effectType]}
        </span>
      </div>

      <p className="card-front__description">{card.description}</p>
    </div>
  )
}

export default CardFront