import Card from '../card/Card'
import './Hand.css'

/**
 * DeckPile - Muestra el mazo de cartas apilado
 * @param {number} count - Cantidad de cartas restantes
 * @param {function} onClick - Callback al hacer click
 */
function DeckPile({ count, onClick }) {
  // Crear capas visuales para el efecto de apilado
  const layers = Math.min(count, 5)
  const layerElements = []

  for (let i = 0; i < layers; i++) {
    layerElements.push(
      <div
        key={i}
        className="deck-pile__layer"
        style={{
          '--layer-index': i,
          top: `${-i * 2}px`,
          left: `${i * 2}px`
        }}
      >
        <Card faceDown size="small" />
      </div>
    )
  }

  return (
    <div
      className={`deck-pile ${count === 0 ? 'deck-pile--empty' : ''} ${onClick ? 'deck-pile--clickable' : ''}`}
      onClick={onClick}
    >
      {count > 0 ? (
        <>
          <div className="deck-pile__layers">
            {layerElements}
          </div>
          <span className="deck-pile__count">{count}</span>
        </>
      ) : (
        <span className="deck-pile__empty-text">Vacío</span>
      )}
    </div>
  )
}

export default DeckPile