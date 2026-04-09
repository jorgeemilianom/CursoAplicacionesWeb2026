import PieceVisual from './PieceVisual'
import { getPiecePath } from '../ArchivosJS/PuzzleShapes.js'
import { readDraggedPiece } from './Drag&Drop'
import { useConfig } from './context/ConfigContext.jsx'
import { usePuzzle } from './context/PuzzleContext.jsx'

function LienzoGame() {
  const { selectedDifficulty } = useConfig()
  const { board, tray, isWon, handleBoardDrop, handleTrayDrop } = usePuzzle()
  const size = selectedDifficulty.size
  const preventDefault = (event) => event.preventDefault()

  const handleDropOnBoard = (event, slot) => {
    event.preventDefault()
    const payload = readDraggedPiece(event)
    if (!payload) return
    handleBoardDrop(payload, slot)
  }

  const handleDropOnTray = (event) => {
    event.preventDefault()
    const payload = readDraggedPiece(event)
    if (!payload) return
    handleTrayDrop(payload)
  }

  return (
    <section className="puzzle-layout">
      <div className="puzzle-stage">
        <header className="puzzle-stage__header">
          <h2>Lienzo del rompecabezas</h2>
          <p>Solta cada pieza en el sector vacio hasta reconstruir toda la imagen.</p>
        </header>
        <div className="puzzle-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {board.map((piece, index) => (
          <div
            key={`slot-${index}`}
            className={`puzzle-slot ${piece ? 'puzzle-slot--filled' : ''}`}
            onDragOver={preventDefault}
            onDrop={(event) => handleDropOnBoard(event, index)}
          >
            {!piece && (
              <svg className="puzzle-slot__guide" viewBox="-20 -20 140 140" aria-hidden="true">
                <path d={getPiecePath(size, index)} />
              </svg>
            )}
            <PieceVisual piece={piece} size={size} source={{ type: 'board', slot: index }} locked={isWon} />
          </div>
        ))}
        </div>
      </div>

      <div className="puzzle-tray" onDragOver={preventDefault} onDrop={handleDropOnTray}>
        <header>
          <h2>Piezas disponibles</h2>
          <p>Arrastralas al tablero y reubicá las que necesites.</p>
        </header>
        <div className="puzzle-tray__grid">
          {tray.map((piece) => (
            <PieceVisual key={piece.id} piece={piece} size={size} source={{ type: 'tray' }} locked={isWon} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LienzoGame
