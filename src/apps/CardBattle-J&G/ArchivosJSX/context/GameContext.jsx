import { createContext, useState, useCallback, useContext } from 'react'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  // Vidas de cada jugador (empiezan en 20)
  const [player1HP, setPlayer1HP] = useState(20)
  const [player2HP, setPlayer2HP] = useState(20)

  // Turno actual: 'player1' | 'player2'
  const [currentTurn, setCurrentTurn] = useState('player1')

  // Estado del juego: 'menu' | 'playing' | 'gameover'
  const [gameStatus, setGameStatus] = useState('menu')

  // Ganador: null | 'player1' | 'player2'
  const [winner, setWinner] = useState(null)

  // Aplicar daño a un jugador
  const applyDamage = useCallback((playerId, amount) => {
    if (playerId === 'player1') {
      setPlayer1HP(prev => Math.max(0, prev - amount))
    } else {
      setPlayer2HP(prev => Math.max(0, prev - amount))
    }
  }, [])

  // Curar a un jugador
  const healPlayer = useCallback((playerId, amount) => {
    if (playerId === 'player1') {
      setPlayer1HP(prev => Math.min(20, prev + amount))
    } else {
      setPlayer2HP(prev => Math.min(20, prev + amount))
    }
  }, [])

  // Terminar turno actual
  const endTurn = useCallback(() => {
    setCurrentTurn(prev => prev === 'player1' ? 'player2' : 'player1')
  }, [])

  // Iniciar nueva partida
  const startGame = useCallback(() => {
    setPlayer1HP(20)
    setPlayer2HP(20)
    setCurrentTurn('player1')
    setGameStatus('playing')
    setWinner(null)
  }, [])

  // Terminar partida (cuando alguien queda sin vida)
  const endGame = useCallback((winnerId) => {
    setWinner(winnerId)
    setGameStatus('gameover')
  }, [])

  // Volver al menú
  const resetGame = useCallback(() => {
    setPlayer1HP(20)
    setPlayer2HP(20)
    setCurrentTurn('player1')
    setGameStatus('menu')
    setWinner(null)
  }, [])

  const value = {
    // Estado
    player1HP,
    player2HP,
    currentTurn,
    gameStatus,
    winner,
    // Acciones
    applyDamage,
    healPlayer,
    endTurn,
    startGame,
    endGame,
    resetGame
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