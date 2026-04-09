import { formatTime, IMAGE_SRC } from './PuzzleLogica'
import { useConfig } from './context/ConfigContext.jsx'
import { usePuzzle } from './context/PuzzleContext.jsx'

function Ganaste() {
  const { selectedDifficulty } = useConfig()
  const { moves, resetGame, seconds } = usePuzzle()

  return (
    <div className="puzzle-win">
      <div className="puzzle-win__card">
        <img
          className="puzzle-win__image"
          src={IMAGE_SRC}
          alt="Imagen completa de Mario Galaxy"
        />
        <h2>!!!Ganaste!!!</h2>
        <p>Completaste correctamente el rompecabezas y la imagen de Mario Galaxy quedo armada.</p>
        <div className="puzzle-win__stats">
          <span>{moves} movimientos</span>
          <span>{formatTime(seconds)}</span>
        </div>
        <button type="button" className="puzzle-btn puzzle-btn--primary" onClick={() => resetGame(selectedDifficulty)}>
          Jugar otra vez
        </button>
      </div>
    </div>
  )
}

export default Ganaste
