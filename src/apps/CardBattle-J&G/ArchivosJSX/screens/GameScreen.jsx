import { useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { useBattle } from '../context/BattleContext'
import BattleBoard from '../battle/BattleBoard'
import './Screens.css'

/**
 * GameScreen - Pantalla principal donde se juega la batalla
 */
function GameScreen() {
  const { player1HP, player2HP, endGame } = useGame()
  const { startBattle, resetBattle } = useBattle()

  useEffect(() => {
    startBattle()
  }, [startBattle])

  useEffect(() => {
    if (player1HP <= 0) {
      endGame('player2')
      resetBattle()
    } else if (player2HP <= 0) {
      endGame('player1')
      resetBattle()
    }
  }, [player1HP, player2HP, endGame, resetBattle])

  return (
    <div className="card-battle__game-screen">
      <BattleBoard />
    </div>
  )
}

export default GameScreen
