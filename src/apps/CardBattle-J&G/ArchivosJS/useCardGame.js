import { useGame } from '../ArchivosJSX/context/GameContext'
import { useDeck } from '../ArchivosJSX/context/DeckContext'
import { useBattle } from '../ArchivosJSX/context/BattleContext'

function useCardGame() {
  const game = useGame()
  const deck = useDeck()
  const battle = useBattle()

  const canDraw = game.turnPhase === 'draw'
  const canPlay = game.turnPhase === 'play'
  const canResolve =
    game.turnPhase === 'resolve' &&
    Boolean(battle.fieldCards.player1) &&
    Boolean(battle.fieldCards.player2)

  const handleDrawCard = () => {
    if (!canDraw) return null
    return battle.drawCardForPlayer(game.currentTurn)
  }

  const handlePlayCard = (cardUniqueId, playerId = game.currentTurn) => {
    if (!canPlay) return false
    return battle.playCard(cardUniqueId, playerId)
  }

  const handleResolveCombat = () => {
    if (!canResolve) return
    battle.resolveCombat()
  }

  return {
    ...game,
    ...deck,
    ...battle,
    canDraw,
    canPlay,
    canResolve,
    handleDrawCard,
    handlePlayCard,
    handleResolveCombat
  }
}

export default useCardGame
