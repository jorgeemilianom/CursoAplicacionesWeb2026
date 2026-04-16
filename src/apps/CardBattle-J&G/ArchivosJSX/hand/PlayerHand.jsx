import Card from '../card/Card'
import './Hand.css'

/**
 * PlayerHand - Muestra la mano del jugador en formato abanico
 * @param {Array} hand - Array de cartas en la mano
 * @param {function} onCardClick - Callback al hacer click/tap en una carta
 * @param {function} onCardDragStart - Callback al iniciar arrastre
 * @param {function} onPlayCard - Callback para jugar carta con boton
 * @param {string} selectedCardId - ID de la carta seleccionada
 * @param {string} playerId - ID del jugador dueño de la mano
 * @param {boolean} canPlay - Si el jugador puede jugar cartas
 */
function PlayerHand({ hand, onCardClick, onCardDragStart, onPlayCard, selectedCardId, playerId, canPlay = false }) {
  if (!hand || hand.length === 0) {
    return (
      <div className="player-hand player-hand--empty">
        <span className="player-hand__empty-text">No hay cartas</span>
      </div>
    )
  }

  const canDrag = false

  return (
    <div className="player-hand">
      {hand.map((card, index) => {
        const isSelected = selectedCardId === card.uniqueId

        return (
          <div
            key={card.uniqueId}
            className="player-hand__card-wrapper"
            style={{ '--index': index }}
            onClick={() => canPlay && onPlayCard?.(card.uniqueId)}
            draggable={canDrag}
            onDragStart={(event) => {
              if (!canDrag) return

              event.dataTransfer.effectAllowed = 'move'
              event.dataTransfer.setData(
                'application/x-card-battle',
                JSON.stringify({ cardUniqueId: card.uniqueId, playerId })
              )

              onCardDragStart?.(card)
            }}
          >
            <Card
              card={card}
              faceDown={false}
              clickable={false}
              selected={isSelected}
              size="medium"
            />
            {canPlay && (
              <button
                type="button"
                className="player-hand__play-btn"
                onClick={(event) => {
                  event.stopPropagation()
                  onPlayCard?.(card.uniqueId)
                }}
              >
                Jugar
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PlayerHand
