import CardFront from './CardFront'
import CardBack from './CardBack'
import './Card.css'

/**
 * Card - Componente principal de carta con efecto de volteo 3D
 * @param {Object} card - Datos de la carta
 * @param {boolean} faceDown - Si está boca abajo
 * @param {boolean} clickable - Si se puede clickear
 * @param {function} onClick - Callback al hacer click
 * @param {boolean} selected - Si está seleccionada
 * @param {string} size - Tamaño: 'small' | 'medium' | 'large'
 */
function Card({
  card,
  faceDown = false,
  clickable = false,
  onClick,
  selected = false,
  size = 'medium'
}) {
  const isFlipped = !faceDown

  const handleClick = () => {
    if (clickable) {
      onClick?.(card)
    }
  }

  const handleDoubleClick = () => {
    if (clickable && !faceDown) {
      onClick?.(card)
    }
  }

  return (
    <div
      className={`card card--${size} ${isFlipped ? 'card--flipped' : ''} ${selected ? 'card--selected' : ''} ${clickable ? 'card--clickable' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="card__inner">
        <div className="card__face card__face--front">
          <CardFront card={card} />
        </div>
        <div className="card__face card__face--back">
          <CardBack />
        </div>
      </div>
    </div>
  )
}

export default Card
