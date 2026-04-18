import Card from '../card/Card'
import './Hand.css'

/**
 * DiscardPile - Muestra la pila de cartas descartadas
 * @param {Array} discarded - Cartas descartadas
 */
function DiscardPile({ discarded }) {
  const count = discarded?.length || 0
  const topCard = count > 0 ? discarded[discarded.length - 1] : null

  return (
    <div className={`discard-pile ${count === 0 ? 'discard-pile--empty' : ''}`}>
      {count > 0 ? (
        <>
          <Card card={topCard} size="small" />
          <span className="discard-pile__count">{count}</span>
        </>
      ) : (
        <span className="discard-pile__empty-text">Descarte</span>
      )}
    </div>
  )
}

export default DiscardPile