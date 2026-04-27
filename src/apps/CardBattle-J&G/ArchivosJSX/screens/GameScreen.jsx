import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import BattleBoard from '../battle/BattleBoard'
import './Screens.css'

function GameScreen() {
  const { player1HP, player2HP, endGame, gameStatus } = useGame()

  const gameEndedRef = useRef(false)

  useEffect(() => {
    // 🚫 si no estamos jugando, no hacer nada
    if (gameStatus !== 'playing') return

    // 🚫 evitar múltiples ejecuciones
    if (gameEndedRef.current) return

    // 🟢 condiciones reales
    if (player1HP <= 0 && player2HP > 0) {
      gameEndedRef.current = true
      endGame('player2')
      return
    }

    if (player2HP <= 0 && player1HP > 0) {
      gameEndedRef.current = true
      endGame('player1')
      return
    }

    if (player1HP <= 0 && player2HP <= 0) {
      gameEndedRef.current = true
      endGame('draw')
      return
    }

  }, [player1HP, player2HP, gameStatus, endGame])

  return (
    <div className="card-battle__game-screen">
      <BattleBoard />
    </div>
  )
}

export default GameScreen