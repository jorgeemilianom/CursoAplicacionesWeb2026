import { IMAGE_SRC } from './PuzzleLogica'
import { getPiecePath } from '../ArchivosJS/PuzzleShapes.js'
import { startPieceDrag } from './Drag&Drop'

function PieceVisual({ piece, size, source, locked = false }) {
  if (!piece) return <div className="puzzle-piece puzzle-piece--empty"></div>

  const column = piece.correctIndex % size
  const row = Math.floor(piece.correctIndex / size)
  const clipId = `clip-${piece.id}`
  const piecePath = getPiecePath(size, piece.correctIndex)

  return (
    <button
      type="button"
      className={`puzzle-piece puzzle-piece--${source.type}`}
      draggable={!locked}
      onDragStart={(event) => startPieceDrag(event, piece.id, source)}
      disabled={locked}
      aria-label={`Pieza ${piece.correctIndex + 1}`}
    >
      <svg className="puzzle-piece__svg" viewBox="-20 -20 140 140" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={piecePath} />
          </clipPath>
        </defs>
        <image
          href={IMAGE_SRC}
          x={-column * 100}
          y={-row * 100}
          width={size * 100}
          height={size * 100}
          preserveAspectRatio="none"
          clipPath={`url(#${clipId})`}
        />
        <path className="puzzle-piece__stroke" d={piecePath} />
        <path className="puzzle-piece__shine" d={piecePath} />
      </svg>
    </button>
  )
}

export default PieceVisual
