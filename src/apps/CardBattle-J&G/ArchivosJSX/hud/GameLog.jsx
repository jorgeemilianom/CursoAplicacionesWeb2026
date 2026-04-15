import { useRef, useEffect } from 'react'
import './HUD.css'

/**
 * GameLog - Historial de acciones de la batalla
 * @param {Array} logs - Array de strings con mensajes
 * @param {number} maxVisible - Máximo de mensajes visibles
 */
function GameLog({ logs, maxVisible = 10 }) {
  const logEndRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  // Mostrar solo los últimos N mensajes
  const visibleLogs = logs.slice(-maxVisible)

  return (
    <div className="game-log">
      <div className="game-log__header">
        <span>📜 Historial</span>
      </div>
      <div className="game-log__content">
        {visibleLogs.map((log, index) => (
          <div
            key={index}
            className={`game-log__entry ${index === visibleLogs.length - 1 ? 'game-log__entry--latest' : ''}`}
          >
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  )
}

export default GameLog