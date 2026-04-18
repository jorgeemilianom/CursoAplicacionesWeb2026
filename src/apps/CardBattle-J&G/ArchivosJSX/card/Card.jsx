import CardFront from './CardFront'
import CardBack from './CardBack'
import './Card.css'

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
    <div className="card-view">
      <div
        className={`card card--${size} ${selected ? 'card--selected' : ''} ${clickable ? 'card--clickable' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <div className="card__inner card__inner--static">
          {isFlipped ? <CardFront card={card} /> : <CardBack />}
        </div>
      </div>
    </div>
  )
}

export default Card
