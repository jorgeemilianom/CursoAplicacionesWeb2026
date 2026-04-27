import { createContext, useState, useCallback, useContext } from 'react'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [player1HP, setPlayer1HP] = useState(20)
  const [player2HP, setPlayer2HP] = useState(20)
  const [player1Name, setPlayer1Name] = useState('Jugador 1')
  const [player2Name] = useState('Jugador 2')
  const [currentTurn, setCurrentTurn] = useState('player1')
  const [gameStatus, setGameStatus] = useState('menu')
  const [turnPhase, setTurnPhase] = useState('draw')
  const [winner, setWinner] = useState(null)

  const applyDamage = useCallback((playerId, amount) => {
    if (playerId === 'player1') {
      setPlayer1HP((prev) => Math.max(0, prev - amount))
    } else {
      setPlayer2HP((prev) => Math.max(0, prev - amount))
    }
  }, [])

  const healPlayer = useCallback((playerId, amount) => {
    if (playerId === 'player1') {
      setPlayer1HP((prev) => Math.min(20, prev + amount))
    } else {
      setPlayer2HP((prev) => Math.min(20, prev + amount))
    }
  }, [])

  const endTurn = useCallback(() => {
    setCurrentTurn((prev) => (prev === 'player1' ? 'player2' : 'player1'))
    setTurnPhase('draw')
  }, [])

  const startGame = useCallback((nextPlayer1Name) => {
    setPlayer1HP(20)
    setPlayer2HP(20)
    setPlayer1Name(nextPlayer1Name?.trim() || 'Jugador 1')
    setCurrentTurn('player1')
    setGameStatus('playing')
    setTurnPhase('draw')
    setWinner(null)
  }, [])

  const endGame = useCallback((winnerId) => {
    setWinner(winnerId)
    setGameStatus('gameover')
    setTurnPhase('gameover')
  }, [])

  const resetGame = useCallback(() => {
    setPlayer1HP(20)
    setPlayer2HP(20)
    setCurrentTurn('player1')
    setGameStatus('menu')
    setTurnPhase('draw')
    setWinner(null)
  }, [])

  const value = {
    player1HP,
    player2HP,
    player1Name,
    player2Name,
    currentTurn,
    gameStatus,
    turnPhase,
    winner,
    applyDamage,
    healPlayer,
    endTurn,
    setTurnPhase,
    startGame,
    endGame,
    resetGame,
    setPlayer1Name
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used inside GameProvider')
  }
  return context
}
