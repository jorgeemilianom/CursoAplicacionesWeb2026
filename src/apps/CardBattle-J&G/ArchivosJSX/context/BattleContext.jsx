import { createContext, useState, useCallback, useContext } from 'react'
import { useDeck } from './DeckContext'
import { useGame } from './GameContext'

const BattleContext = createContext(null)

export function BattleProvider({ children }) {
  // Consumimos DeckContext para acceder al mazo
  const { shuffledDeck, createShuffledDeck, dealInitialHand, drawCard } = useDeck()
  // Consumimos GameContext para verificar turno y aplicar efectos
  const { currentTurn, applyDamage, healPlayer, endTurn } = useGame()

  // Manos de cada jugador
  const [player1Hand, setPlayer1Hand] = useState([])
  const [player2Hand, setPlayer2Hand] = useState([])

  // Cartas en el campo (slot de cada jugador)
  const [fieldCards, setFieldCards] = useState({
    player1: null,
    player2: null
  })

  // Efecto activo (para mostrar notificación)
  const [activeEffect, setActiveEffect] = useState(null)

  // Historial de acciones (para el log de batalla)
  const [battleLog, setBattleLog] = useState([])

  // Mazo restante
  const [remainingDeck, setRemainingDeck] = useState([])

  // Escudos activos de cada jugador
  const [player1Shield, setPlayer1Shield] = useState(0)
  const [player2Shield, setPlayer2Shield] = useState(0)

  // Iniciar una nueva batalla
  const startBattle = useCallback(() => {
    const deck = createShuffledDeck()
    const { player1Hand: p1, player2Hand: p2, remainingDeck: remaining } = dealInitialHand(deck, 5)

    setPlayer1Hand(p1)
    setPlayer2Hand(p2)
    setRemainingDeck(remaining)
    setFieldCards({ player1: null, player2: null })
    setBattleLog(['¡La batalla ha comenzado!'])
    setPlayer1Shield(0)
    setPlayer2Shield(0)
    setActiveEffect(null)
  }, [createShuffledDeck, dealInitialHand])

  // Jugar una carta al campo
  const playCard = useCallback((cardUniqueKey, playerId) => {
    // Verificar que es el turno del jugador
    if (currentTurn !== playerId) {
      console.warn('No es tu turno')
      return false
    }

    // Verificar que el slot está libre
    if (fieldCards[playerId]) {
      console.warn('Ya tienes una carta en el campo')
      return false
    }

    // Obtener la carta de la mano
    const hand = playerId === 'player1' ? player1Hand : player2Hand
    const cardIndex = hand.findIndex(c => c.uniqueId === cardUniqueKey)

    if (cardIndex === -1) {
      console.warn('Carta no encontrada en la mano')
      return false
    }

    const card = hand[cardIndex]

    // Remover carta de la mano
    const newHand = [...hand]
    newHand.splice(cardIndex, 1)

    if (playerId === 'player1') {
      setPlayer1Hand(newHand)
    } else {
      setPlayer2Hand(newHand)
    }

    // Poner carta en el campo
    setFieldCards(prev => ({
      ...prev,
      [playerId]: card
    }))

    // Agregar al log
    addLog(`${playerId === 'player1' ? 'Jugador 1' : 'Jugador 2'} jugó ${card.name}`)

    return true
  }, [currentTurn, fieldCards, player1Hand, player2Hand])

  // Resolver el combate cuando ambos tienen carta en campo
  const resolveCombat = useCallback(() => {
    const { player1: card1, player2: card2 } = fieldCards

    if (!card1 || !card2) {
      console.warn('Ambos jugadores deben tener cartas en el campo')
      return
    }

    // Calcular daño
    let damage1to2 = Math.max(0, card1.attack - card2.defense)
    let damage2to1 = Math.max(0, card2.attack - card1.defense)

    // Aplicar escudos
    if (player2Shield > 0) {
      const blocked = Math.min(player2Shield, damage1to2)
      damage1to2 -= blocked
      setPlayer2Shield(prev => prev - blocked)
      if (blocked > 0) addLog(`Escudo bloqueó ${blocked} de daño`)
    }

    if (player1Shield > 0) {
      const blocked = Math.min(player1Shield, damage2to1)
      damage2to1 -= blocked
      setPlayer1Shield(prev => prev - blocked)
      if (blocked > 0) addLog(`Escudo bloqueó ${blocked} de daño`)
    }

    // Aplicar daño
    if (damage1to2 > 0) {
      applyDamage('player2', damage1to2)
      addLog(`${card1.name} infligió ${damage1to2} de daño`)
    }
    if (damage2to1 > 0) {
      applyDamage('player1', damage2to1)
      addLog(`${card2.name} infligió ${damage2to1} de daño`)
    }

    // Aplicar efectos de las cartas
    applyCardEffect(card1, 'player1')
    applyCardEffect(card2, 'player2')

    // Limpiar campo después del combate
    setFieldCards({ player1: null, player2: null })

    // Cambiar turno
    endTurn()
  }, [fieldCards, player1Shield, player2Shield, applyDamage, endTurn])

  // Aplicar efecto especial de una carta
  const applyCardEffect = useCallback((card, playerId) => {
    const { effectType, effectValue } = card
    let effectMessage = ''

    switch (effectType) {
      case 'damage':
        const opponent = playerId === 'player1' ? 'player2' : 'player1'
        applyDamage(opponent, effectValue)
        effectMessage = `${card.name} infligió ${effectValue} de daño extra`
        break

      case 'heal':
        healPlayer(playerId, effectValue)
        effectMessage = `${card.name} curó ${effectValue} puntos de vida`
        break

      case 'shield':
        if (playerId === 'player1') {
          setPlayer1Shield(prev => prev + effectValue)
        } else {
          setPlayer2Shield(prev => prev + effectValue)
        }
        effectMessage = `${card.name} otorgó ${effectValue} de escudo`
        break

      case 'draw':
        const { drawn, remaining } = drawCard(remainingDeck, effectValue)
        if (drawn.length > 0) {
          if (playerId === 'player1') {
            setPlayer1Hand(prev => [...prev, ...drawn])
          } else {
            setPlayer2Hand(prev => [...prev, ...drawn])
          }
          setRemainingDeck(remaining)
          effectMessage = `${card.name} permitió robar ${drawn.length} carta(s)`
        }
        break
    }

    // Mostrar notificación del efecto
    setActiveEffect({ card, message: effectMessage })
    addLog(effectMessage)

    // Limpiar notificación después de 2 segundos
    setTimeout(() => setActiveEffect(null), 2000)
  }, [applyDamage, healPlayer, drawCard, remainingDeck])

  // Robar carta al inicio del turno
  const drawCardForPlayer = useCallback((playerId) => {
    if (remainingDeck.length === 0) {
      addLog('¡No quedan cartas en el mazo!')
      return null
    }

    const { drawn, remaining } = drawCard(remainingDeck, 1)
    setRemainingDeck(remaining)

    if (playerId === 'player1') {
      setPlayer1Hand(prev => [...prev, ...drawn])
    } else {
      setPlayer2Hand(prev => [...prev, ...drawn])
    }

    addLog(`${playerId === 'player1' ? 'Jugador 1' : 'Jugador 2'} robó una carta`)
    return drawn[0]
  }, [remainingDeck, drawCard])

  // Agregar mensaje al log
  const addLog = useCallback((message) => {
    setBattleLog(prev => [...prev, message])
  }, [])

  // Reiniciar batalla
  const resetBattle = useCallback(() => {
    setPlayer1Hand([])
    setPlayer2Hand([])
    setFieldCards({ player1: null, player2: null })
    setRemainingDeck([])
    setBattleLog([])
    setPlayer1Shield(0)
    setPlayer2Shield(0)
    setActiveEffect(null)
  }, [])

  const value = {
    // Estado
    player1Hand,
    player2Hand,
    fieldCards,
    activeEffect,
    battleLog,
    remainingDeck,
    player1Shield,
    player2Shield,
    // Acciones
    startBattle,
    playCard,
    resolveCombat,
    drawCardForPlayer,
    addLog,
    resetBattle
  }

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  )
}

export function useBattle() {
  const context = useContext(BattleContext)
  if (!context) {
    throw new Error('useBattle must be used inside BattleProvider')
  }
  return context
}