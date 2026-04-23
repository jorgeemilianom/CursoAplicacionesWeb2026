import './Card.css'

function CardFront({ card }) {
  if (!card) return null

  const rarityClass = `card-front--${card.rarity}`
  const elementClass = card.tipo ? `card-front--${card.tipo}` : ''
  const elementName = card.tipo ? `${card.tipo.charAt(0).toUpperCase()}${card.tipo.slice(1)}` : 'Neutral'
  
  const elementIcons = {
    fuego: '🔥', agua: '💧', tierra: '🌿', aire: '💨',
    electrico: '⚡', vacio: '🕳️', psiquico: '🔮'
  }

  const effectIcon = { damage: '⚔️', heal: '💚', shield: '🛡️', draw: '📚' }
  const effectLabel = {
    damage: 'Ataque',
    heal: 'Curacion',
    shield: 'Defensa',
    draw: 'Robo'
  }
  const effectBadge = {
    damage: 'ATQ',
    heal: 'CUR',
    shield: 'DEF',
    draw: 'ROB'
  }
  const rarityBadge = {
    common: 'COM',
    rare: 'RAR',
    legendary: 'LEG'
  }

  const displayIcon = card.tipo ? elementIcons[card.tipo] : effectIcon[card.effectType]

  return (
    <div className={`card-front ${rarityClass} ${elementClass}`}>
      
      <div className="card-front__frame" />

      <div className="card-front__header">
        <h3 className="card-front__name">{card.name}</h3>
        <span className="card-front__rarity">
          {card.rarity === 'legendary' ? '⭐' : card.rarity === 'rare' ? '◆' : '○'}
        </span>
      </div>

      {/* 🔥 IMAGEN AGREGADA */}
      <div className={`card-front__image ${card.image ? 'card-front__image--with-art' : ''}`}>
        
        {card.image && (
          <img
            src={card.image}
            alt={card.name}
            className="card-front__img"
          />
        )}

        <span className="card-front__element-chip">
          <span className="card-front__element-icon">{displayIcon}</span>
          <span className="card-front__element-name">{elementName}</span>
        </span>

        {!card.image && <div className="card-front__image-badge">{displayIcon}</div>}

        <div className="card-front__effect-line">
          <span className="card-front__effect-label">{effectLabel[card.effectType] || 'Efecto'}</span>
          <span className="card-front__effect-value">+{card.effectValue ?? 0}</span>
        </div>
      </div>

      <p className="card-front__description">{card.description}</p>

      <div className="card-front__stats-line">
        <span className="card-front__footer-rarity">{rarityBadge[card.rarity] || 'COM'}</span>
        <span className="card-front__stats-inline">ATK/{card.attack}</span>
        <span className="card-front__stats-inline">DEF/{card.defense}</span>
        <span className="card-front__footer-type">{effectBadge[card.effectType] || 'EFX'}</span>
      </div>

    </div>
  )
}

export default CardFront
