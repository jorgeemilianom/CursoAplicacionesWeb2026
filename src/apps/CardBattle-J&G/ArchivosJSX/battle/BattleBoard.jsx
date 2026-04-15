import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { useBattle } from '../context/BattleContext'
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
  const { player1HP, player2HP, currentTurn } = useGame()
  const {
    player1Hand,
    player2Hand,
    fieldCards,
    battleLog,
    remainingDeck,
    activeEffect,
    player1Shield,
    player2Shield,
    playCard,
    resolveCombat,
    drawCardForPlayer
  } = useBattle()

  const [selectedCard, setSelectedCard] = useState(null)

  const handleCardSelect = (card) => {
    setSelectedCard(prev => prev?.uniqueId === card.uniqueId ? null : card)
  }

  const handleSlotClick = (playerId) => {
    if (selectedCard && playerId === currentTurn) {
      const success = playCard(selectedCard.uniqueId, playerId)
      if (success) {
        setSelectedCard(null)
      }
    }
  }

  const handleDrawCard = () => {
    if (remainingDeck.length > 0) {
      drawCardForPlayer(currentTurn)
    }
  }

  const canResolve = fieldCards.player1 && fieldCards.player2

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
        <TurnIndicator currentTurn={currentTurn} />
        <DeckPile count={remainingDeck.length} onClick={handleDrawCard} />
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
          onResolve={resolveCombat}
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