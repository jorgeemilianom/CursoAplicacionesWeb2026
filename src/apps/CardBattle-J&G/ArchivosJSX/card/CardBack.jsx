import './Card.css'

/**
 * CardBack - Muestra el reverso de una carta (boca abajo)
 * Diseño simple con un patrón decorativo
 */
function CardBack() {
  return (
    <div className="card-back">
      <div className="card-back__pattern">
        <div className="card-back__inner">
          <span className="card-back__symbol">⚔️</span>
          <span className="card-back__text">CARD BATTLE</span>
        </div>
      </div>
    </div>
  )
}

export default CardBack