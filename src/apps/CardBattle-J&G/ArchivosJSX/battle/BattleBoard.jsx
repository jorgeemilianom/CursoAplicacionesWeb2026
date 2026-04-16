import { useState, useEffect } from 'react'
import useCardGame from '../../ArchivosJS/useCardGame'
import PlayerZone from './PlayerZone'
import BattleField from './BattleField'
import DeckPile from '../hand/DeckPile'
import GameLog from '../hud/GameLog'
import TurnIndicator from '../hud/TurnIndicator'
import EffectNotification from '../hud/EffectNotification'
import './Battle.css'

function BattleBoard() {
  const {
    player1HP, player2HP, currentTurn, turnPhase,
    player1Hand, player2Hand, fieldCards, battleLog,
    remainingDeck, activeEffect, player1Shield, player2Shield,
    canDraw, canResolve, handleDrawCard, handlePlayCard, handleResolveCombat
  } = useCardGame()

  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    setSelectedCard(null)
  }, [currentTurn, turnPhase])

  useEffect(() => {
    if (turnPhase !== 'draw') return
    handleDrawCard()
  }, [turnPhase, handleDrawCard])

  useEffect(() => {
    // Jugador 2 (slot superior) juega automatico para que el usuario se enfoque en slot 1.
    if (currentTurn !== 'player2' || turnPhase !== 'play') return
    if (fieldCards.player2 || player2Hand.length === 0) return
    handlePlayCard(player2Hand[0].uniqueId, 'player2')
  }, [currentTurn, turnPhase, fieldCards.player2, player2Hand, handlePlayCard])

  const handleCardSelect = (card, playerId) => {
    if (playerId !== currentTurn || turnPhase !== 'play') return

    if (
      selectedCard?.ownerId === playerId &&
      selectedCard?.card?.uniqueId === card.uniqueId
    ) {
      setSelectedCard(null)
      return
    }

    setSelectedCard({ ownerId: playerId, card })
  }

  const handleCardDragStart = (card, playerId) => {
    if (playerId !== currentTurn || turnPhase !== 'play') return
    setSelectedCard({ ownerId: playerId, card })
  }

  const handleCardPlayFromButton = (playerId, cardUniqueId) => {
    if (playerId !== currentTurn || turnPhase !== 'play') return
    const targetCardId = cardUniqueId ?? selectedCard?.card?.uniqueId
    if (!targetCardId) return

    const success = handlePlayCard(targetCardId, playerId)
    if (success) {
      setSelectedCard(null)
    }
  }

  const handleSlotClick = (playerId) => {
    if (!selectedCard || selectedCard.ownerId !== playerId || playerId !== currentTurn) {
      return
    }

    const success = handlePlayCard(selectedCard.card.uniqueId, playerId)
    if (success) {
      setSelectedCard(null)
    }
  }

  const handleSlotDrop = (playerId, payload) => {
    if (!payload?.cardUniqueId) return
    if (playerId !== currentTurn || turnPhase !== 'play') return
    if (payload.playerId !== playerId) return

    const success = handlePlayCard(payload.cardUniqueId, playerId)
    if (success) {
      setSelectedCard(null)
    }
  }

  const player1Data = { hp: player1HP, shield: player1Shield, hand: player1Hand }
  const player2Data = { hp: player2HP, shield: player2Shield, hand: player2Hand }

  return (
    <div className="battle-board">
      <EffectNotification effect={activeEffect} />

      <div className="battle-board__sidebar">
        <TurnIndicator currentTurn={currentTurn} turnPhase={turnPhase} />
        <DeckPile count={remainingDeck.length} onClick={canDraw ? handleDrawCard : undefined} />
        <GameLog logs={battleLog} />
      </div>

      <div className="battle-board__main">
        <div>
          <PlayerZone
            playerId="player2"
            player={player2Data}
            fieldCard={fieldCards.player2}
            isCurrentTurn={currentTurn === 'player2'}
            selectedCardId={selectedCard?.ownerId === 'player2' ? selectedCard.card.uniqueId : null}
            canPlay={false}
            showHand={false}
            onCardSelect={(card) => handleCardSelect(card, 'player2')}
            onCardDragStart={(card) => handleCardDragStart(card, 'player2')}
            onPlayCard={(cardUniqueId) => handleCardPlayFromButton('player2', cardUniqueId)}
            onSlotClick={handleSlotClick}
            onSlotDrop={handleSlotDrop}
          />
        </div>

        <div>
          <BattleField
            player1Card={fieldCards.player1}
            player2Card={fieldCards.player2}
            canResolve={canResolve}
            onResolve={handleResolveCombat}
          />
        </div>

        <div>
          <PlayerZone
            playerId="player1"
            player={player1Data}
            fieldCard={fieldCards.player1}
            isCurrentTurn={currentTurn === 'player1'}
            selectedCardId={selectedCard?.ownerId === 'player1' ? selectedCard.card.uniqueId : null}
            canPlay={currentTurn === 'player1' && turnPhase === 'play' && !fieldCards.player1}
            showHand
            onCardSelect={(card) => handleCardSelect(card, 'player1')}
            onCardDragStart={(card) => handleCardDragStart(card, 'player1')}
            onPlayCard={(cardUniqueId) => handleCardPlayFromButton('player1', cardUniqueId)}
            onSlotClick={handleSlotClick}
            onSlotDrop={handleSlotDrop}
          />
        </div>
      </div>
    </div>
  )
}

export default BattleBoard
