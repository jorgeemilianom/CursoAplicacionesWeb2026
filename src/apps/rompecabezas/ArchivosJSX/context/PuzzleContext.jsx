import { createContext, useContext } from 'react'
import { useConfig } from './ConfigContext.jsx'
import { usePuzzleGame } from '../../ArchivosJS/usePuzzleGame.js'

const PuzzleContext = createContext(null)

export function PuzzleProvider({ children }) {
  const { selectedDifficulty } = useConfig()
  const value = usePuzzleGame(selectedDifficulty)
  return <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>
}

export function usePuzzle() {
  const context = useContext(PuzzleContext)
  if (!context) throw new Error('usePuzzle must be used inside PuzzleProvider')
  return context
}
