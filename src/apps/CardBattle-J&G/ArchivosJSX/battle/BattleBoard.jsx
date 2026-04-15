import { useState } from 'react'
import useCardGame from '../../ArchivosJS/useCardGame'
import PlayerZone from './PlayerZone'
import BattleField from './BattleField'
import DeckPile from '../hand/DeckPile'
import GameLog from '../hud/GameLog'
import TurnIndicator from '../hud/TurnIndicator'
import EffectNotification from '../hud/EffectNotification'
import './Battle.css'

/**
 * BattleBoard - Tablero principal del juego
 */
function BattleBoard() {
  const {
    player1HP,
    player2HP,
    currentTurn,
    turnPhase,
    player1Hand,
    player2Hand,
    fieldCards,
    battleLog,
    remainingDeck,
    activeEffect,
    player1Shield,
    player2Shield,
    canDraw,
    canResolve,
    handleDrawCard,
    handlePlayCard,
    handleResolveCombat
  } = useCardGame()

  const [selectedCard, setSelectedCard] = useState(null)

  const handleCardSelect = (card) => {
    setSelectedCard(prev => prev?.uniqueId === card.uniqueId ? null : card)
  }

  const handleSlotClick = (playerId) => {
    if (selectedCard && playerId === currentTurn) {
      const success = handlePlayCard(selectedCard.uniqueId, playerId)
      if (success) {
        setSelectedCard(null)
      }
    }
  }

  // Datos de cada jugador para PlayerZone
  const player1Data = {
    hp: player1HP,
    shield: player1Shield,
    hand: player1Hand
  }

  const player2Data = {
    hp: player2HP,
    shield: player2Shield,
    hand: player2Hand
  }

  return (
    <div className="battle-board">
      <EffectNotification effect={activeEffect} />

      <div className="battle-board__sidebar battle-board__sidebar--left">
        <TurnIndicator currentTurn={currentTurn} turnPhase={turnPhase} />
        <DeckPile count={remainingDeck.length} onClick={canDraw ? handleDrawCard : undefined} />
        <GameLog logs={battleLog} />
      </div>

      <div className="battle-board__main">
        <PlayerZone
          playerId="player2"
          player={player2Data}
          fieldCard={fieldCards.player2}
          isCurrentTurn={currentTurn === 'player2'}
          selectedCardId={selectedCard?.uniqueId}
          onCardSelect={handleCardSelect}
          onSlotClick={handleSlotClick}
        />

        <BattleField
          player1Card={fieldCards.player1}
          player2Card={fieldCards.player2}
          canResolve={canResolve}
          onResolve={handleResolveCombat}
        />

        <PlayerZone
          playerId="player1"
          player={player1Data}
          fieldCard={fieldCards.player1}
          isCurrentTurn={currentTurn === 'player1'}
          selectedCardId={selectedCard?.uniqueId}
          onCardSelect={handleCardSelect}
          onSlotClick={handleSlotClick}
        />
      </div>
    </div>
  )
}

export default BattleBoard
