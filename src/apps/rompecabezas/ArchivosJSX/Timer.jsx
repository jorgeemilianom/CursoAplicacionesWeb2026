import { useEffect } from 'react'
import { usePuzzle } from './context/PuzzleContext.jsx'
import { formatTime } from './PuzzleLogica'

function Timer() {
  const { seconds, isRunning, tick } = usePuzzle()

  useEffect(() => {
    if (!isRunning) return undefined

    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [isRunning, tick])

  return (
    <div className={`puzzle-timer ${isRunning ? 'puzzle-timer--on' : ''}`}>
      <span>Tiempo</span>
      <strong>{formatTime(seconds)}</strong>
    </div>
  )
}

export default Timer
