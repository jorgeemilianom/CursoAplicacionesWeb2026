import './Card.css'

/**
 * CardEffect - Muestra una animación de efecto al jugar una carta
 * @param {Object} effect - { card, message }
 */
function CardEffect({ effect }) {
  if (!effect) return null

  const { card, message } = effect

  // Colores para efectos normales y para los nuevos skins elementales
  const effectColors = {
    // Efectos base
    damage: '#ff6b6b',
    heal: '#4ecdc4',
    shield: '#45b7d1',
    draw: '#9b59b6',
    // Nuevos elementos
    fuego: '#ff4500',
    agua: '#1e90ff',
    tierra: '#32cd32',
    aire: '#f0f8ff',
    electrico: '#00ffff', // Neón cian
    vacio: '#9b59b6',    // Púrpura oscuro
    psiquico: '#ff00ff'  // Magenta
  }

  // Prioriza el color del elemento si la carta lo tiene
  const color = effectColors[card.tipo] || effectColors[card.effectType] || '#fff'

  return (
    <div className="card-effect" style={{ '--effect-color': color }}>
      <div className="card-effect__content">
        <div className="card-effect__icon">
          {/* Si es elemental mostramos un destello, sino el icono de acción */}
          {card.tipo ? '✨' : (
            <>
              {card.effectType === 'damage' && '⚔️'}
              {card.effectType === 'heal' && '💚'}
              {card.effectType === 'shield' && '🛡️'}
              {card.effectType === 'draw' && '📚'}
            </>
          )}
        </div>
        <div className="card-effect__card-name">{card.name}</div>
        <div className="card-effect__message">{message}</div>
      </div>
    </div>
  )
}

export default CardEffect