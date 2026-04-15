import Card from '../card/Card'
import './Hand.css'

/**
 * PlayerHand - Muestra la mano del jugador en formato abanico
 * @param {Array} hand - Array de cartas en la mano
 * @param {function} onCardClick - Callback al hacer click en una carta
 * @param {string} selectedCardId - ID de la carta seleccionada
 * @param {boolean} canPlay - Si el jugador puede jugar cartas
 */
function PlayerHand({ hand, onCardClick, selectedCardId, canPlay = false }) {
  if (!hand || hand.length === 0) {
    return (
      <div className="player-hand player-hand--empty">
        <span className="player-hand__empty-text">No hay cartas</span>
      </div>
    )
  }

  const middleIndex = (hand.length - 1) / 2

  return (
    <div className="player-hand">
      {hand.map((card, index) => {
        // Calcular rotación para efecto abanico
        const rotation = (index - middleIndex) * 8
        const isSelected = selectedCardId === card.uniqueId

        return (
          <div
            key={card.uniqueId}
            className="player-hand__card-wrapper"
            style={{
              '--rotation': `${rotation}deg`,
              '--index': index
            }}
          >
            <Card
              card={card}
              clickable={canPlay}
              onClick={() => canPlay && onCardClick?.(card)}
              selected={isSelected}
              size="medium"
            />
          </div>
        )
      })}
    </div>
  )
}

export default PlayerHand