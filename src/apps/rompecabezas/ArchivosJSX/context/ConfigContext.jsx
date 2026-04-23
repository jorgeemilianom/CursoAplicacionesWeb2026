import { createContext, useContext, useState } from 'react'
import { DIFFICULTIES } from '../PuzzleLogica.jsx'

const ConfigContext = createContext(null)

export function ConfigProvider({ children }) {
  const [difficultyId, setDifficultyId] = useState(DIFFICULTIES[0].id)
  const selectedDifficulty = DIFFICULTIES.find((item) => item.id === difficultyId) ?? DIFFICULTIES[0]

  return (
    <ConfigContext.Provider
      value={{ difficultyId, difficultyOptions: DIFFICULTIES, selectedDifficulty, setDifficultyId }}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) throw new Error('useConfig must be used inside ConfigProvider')
  return context
}
