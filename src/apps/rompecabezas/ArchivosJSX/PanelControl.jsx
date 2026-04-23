import DifficultySelector from './DifficultySelector'
import Timer from './Timer'
import { useConfig } from './context/ConfigContext.jsx'
import { usePuzzle } from './context/PuzzleContext.jsx'

function PanelControl() {
  const { selectedDifficulty } = useConfig()
  const { moves, placedCount, resetGame, totalPieces } = usePuzzle()

  return (
    <section className="puzzle-panel">
      <DifficultySelector />
      <div className="puzzle-panel__stats">
        <Timer />
        <div><span>Movimientos</span><strong>{moves}</strong></div>
        <div><span>Progreso</span><strong>{placedCount} / {totalPieces}</strong></div>
      </div>
      <div className="puzzle-panel__actions">
        <button type="button" className="puzzle-btn puzzle-btn--primary" onClick={() => resetGame(selectedDifficulty)}>
          Mezclar
        </button>
        <button type="button" className="puzzle-btn puzzle-btn--ghost" onClick={() => resetGame(selectedDifficulty)}>
          Limpiar tablero
        </button>
      </div>
    </section>
  )
}

export default PanelControl
