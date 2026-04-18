import { useState, useEffect, useRef } from 'react'
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
    canDraw, canResolve, addLog, handleDrawCard, handlePlayCard, handleResolveCombat
  } = useCardGame()

  const [selectedCard, setSelectedCard] = useState(null)
  const playerPatternRef = useRef({
    byEffect: {
      damage: 0,
      heal: 0,
      shield: 0,
      draw: 0
    },
    streak: 0,
    lastEffectType: null
  })

  const registerPlayerPattern = (card) => {
    if (!card?.effectType) return

    const pattern = playerPatternRef.current
    pattern.byEffect[card.effectType] = (pattern.byEffect[card.effectType] || 0) + 1

    if (pattern.lastEffectType === card.effectType) {
      pattern.streak += 1
    } else {
      pattern.lastEffectType = card.effectType
      pattern.streak = 1
    }
  }

  const readPlayerPattern = () => {
    const pattern = playerPatternRef.current
    const entries = Object.entries(pattern.byEffect)
    const total = entries.reduce((sum, [, count]) => sum + count, 0)

    if (total < 3) {
      return { detected: false }
    }

    const [preferredEffect, preferredCount] = entries.reduce((best, current) =>
      current[1] > best[1] ? current : best
    , ['damage', 0])

    const confidence = preferredCount / total
    const detected = confidence >= 0.4 || pattern.streak >= 2

    return {
      detected,
      preferredEffect,
      confidence,
      streak: pattern.streak
    }
  }

  const scoreBotCard = (card) => {
    const pattern = readPlayerPattern()
    const playerFieldCard = fieldCards.player1
    let score = card.attack * 1.4 + card.defense

    if (card.effectType === 'damage') {
      score += card.effectValue * 1.8
    }

    if (card.effectType === 'heal') {
      score += (20 - player2HP) * 0.5 + card.effectValue
    }

    if (card.effectType === 'shield') {
      score += Math.max(0, player1HP - player2HP) * 0.35 + card.effectValue * 1.1
    }

    if (card.effectType === 'draw') {
      score += remainingDeck.length > 0 ? 2 + card.effectValue : -1
    }

    if (playerFieldCard) {
      const projectedDamage = Math.max(0, card.attack - playerFieldCard.defense)
      const projectedBlock = Math.max(0, playerFieldCard.attack - card.defense)
      score += projectedDamage * 2.2
      score -= projectedBlock * 1.1

      if (playerFieldCard.effectType === 'damage' && card.effectType === 'shield') {
        score += 4
      }
    }

    if (pattern.detected) {
      if (pattern.preferredEffect === 'damage') {
        if (card.effectType === 'shield') score += 6
        if (card.defense >= 4) score += 3
      }

      if (pattern.preferredEffect === 'heal' || pattern.preferredEffect === 'draw') {
        if (card.effectType === 'damage') score += 5
        if (card.attack >= 4) score += 2
      }

      if (pattern.preferredEffect === 'shield') {
        if (card.effectType === 'damage') score += 4
        if (card.attack >= 5) score += 3
      }
    }

    score += Math.random() * 0.75

    return score
  }

  const pickBotCard = () => {
    if (player2Hand.length === 0) return null

    return player2Hand.reduce((bestCard, currentCard) => {
      if (!bestCard) return currentCard
      return scoreBotCard(currentCard) > scoreBotCard(bestCard) ? currentCard : bestCard
    }, null)
  }

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

    const selectedBotCard = pickBotCard()
    if (!selectedBotCard) return

    const pattern = readPlayerPattern()
    const thinkTime = 700 + Math.random() * 600

    const timer = window.setTimeout(() => {
      if (pattern.detected) {
        addLog(`La IA detecto tu patron: priorizas ${pattern.preferredEffect}`)
      }

      addLog(`La IA juega ${selectedBotCard.name}`)
      handlePlayCard(selectedBotCard.uniqueId, 'player2')
    }, thinkTime)

    return () => window.clearTimeout(timer)
  }, [
    currentTurn,
    turnPhase,
    fieldCards.player2,
    player2Hand,
    addLog,
    handlePlayCard,
    player1HP,
    player2HP,
    player1Shield,
    remainingDeck,
    fieldCards.player1
  ])

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

    const playedCard = playerId === 'player1'
      ? player1Hand.find((card) => card.uniqueId === targetCardId)
      : null
    const success = handlePlayCard(targetCardId, playerId)
    if (success) {
      if (playedCard) {
        registerPlayerPattern(playedCard)
      }
      setSelectedCard(null)
    }
  }

  const handleSlotClick = (playerId) => {
    if (!selectedCard || selectedCard.ownerId !== playerId || playerId !== currentTurn) {
      return
    }

    const success = handlePlayCard(selectedCard.card.uniqueId, playerId)
    if (success) {
      if (playerId === 'player1') {
        registerPlayerPattern(selectedCard.card)
      }
      setSelectedCard(null)
    }
  }

  const handleSlotDrop = (playerId, payload) => {
    if (!payload?.cardUniqueId) return
    if (playerId !== currentTurn || turnPhase !== 'play') return
    if (payload.playerId !== playerId) return

    const playedCard = playerId === 'player1'
      ? player1Hand.find((card) => card.uniqueId === payload.cardUniqueId)
      : null
    const success = handlePlayCard(payload.cardUniqueId, playerId)
    if (success) {
      if (playedCard) {
        registerPlayerPattern(playedCard)
      }
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
        <PlayerZone
          playerId="player2"
          player={player2Data}
          isCurrentTurn={currentTurn === 'player2'}
          selectedCardId={selectedCard?.ownerId === 'player2' ? selectedCard.card.uniqueId : null}
          canPlay={false}
          showHand={false}
          onCardSelect={(card) => handleCardSelect(card, 'player2')}
          onCardDragStart={(card) => handleCardDragStart(card, 'player2')}
          onPlayCard={(cardUniqueId) => handleCardPlayFromButton('player2', cardUniqueId)}
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
          isCurrentTurn={currentTurn === 'player1'}
          selectedCardId={selectedCard?.ownerId === 'player1' ? selectedCard.card.uniqueId : null}
          canPlay={currentTurn === 'player1' && turnPhase === 'play' && !fieldCards.player1}
          showHand
          onCardSelect={(card) => handleCardSelect(card, 'player1')}
          onCardDragStart={(card) => handleCardDragStart(card, 'player1')}
          onPlayCard={(cardUniqueId) => handleCardPlayFromButton('player1', cardUniqueId)}
        />
      </div>
    </div>
  )
}

export default BattleBoard
