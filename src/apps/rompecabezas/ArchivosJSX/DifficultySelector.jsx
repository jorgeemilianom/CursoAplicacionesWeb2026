import { useConfig } from './context/ConfigContext.jsx'
import { usePuzzle } from './context/PuzzleContext.jsx'

function DifficultySelector() {
  const { difficultyOptions, difficultyId, setDifficultyId } = useConfig()
  const { isRunning } = usePuzzle()

  return (
    <div className="puzzle-difficulty">
      {difficultyOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={difficultyId === option.id ? 'is-active' : ''}
          onClick={() => setDifficultyId(option.id)}
          disabled={isRunning}
        >
          <strong>{option.label}</strong>
          <span>{option.help}</span>
        </button>
      ))}
    </div>
  )
}

export default DifficultySelector
