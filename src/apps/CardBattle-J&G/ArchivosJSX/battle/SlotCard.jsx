import Card from '../card/Card'
import { useState } from 'react'
import './Battle.css'

/**
 * SlotCard - Un slot donde colocar una carta en el campo de batalla
 * @param {Object} card - Carta colocada en el slot (null si está vacío)
 * @param {string} playerId - 'player1' | 'player2'
 * @param {function} onClick - Callback al hacer click
 * @param {boolean} isActive - Si el slot está activo
 * @param {boolean} compact - Modo compacto para la banda horizontal
 */
function SlotCard({ card, playerId, onClick, onDropCard, isActive = false, canDrop = false, compact = false }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (event) => {
    if (!canDrop || card) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    if (!canDrop || card) return
    event.preventDefault()
    setIsDragOver(false)

    const rawPayload = event.dataTransfer.getData('application/x-card-battle')
    if (!rawPayload) return

    try {
      const payload = JSON.parse(rawPayload)
      onDropCard?.(playerId, payload)
    } catch (error) {
      console.warn('No se pudo leer la carta arrastrada', error)
    }
  }

  const className = `slot-card ${card ? 'slot-card--filled' : 'slot-card--empty'} ${isActive ? 'slot-card--active' : ''} ${isDragOver ? 'slot-card--drag-over' : ''} ${compact ? 'slot-card--compact' : ''}`.trim()

  return (
    <div
      className={className}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {card ? (
        <Card card={card} size={compact ? 'slot' : 'large'} clickable={false} />
      ) : (
        <div className="slot-card__placeholder">
          <span className="slot-card__icon">+</span>
          <span className="slot-card__text">
            {playerId === 'player1' ? 'Tu slot' : 'Oponente'}
          </span>
        </div>
      )}
    </div>
  )
}

export default SlotCard
