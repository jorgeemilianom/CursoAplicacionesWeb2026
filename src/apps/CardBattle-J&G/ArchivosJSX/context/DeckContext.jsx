import { createContext, useState, useCallback, useContext } from 'react'
import { cardData, shuffleDeck } from '../../ArchivosJS/cardData'

const DeckContext = createContext(null)
const REQUIRED_CARD_FIELDS = ['id', 'name', 'attack', 'defense', 'effectType', 'effectValue', 'rarity']

function validateCardData(cards) {
  const duplicateIds = cards.reduce((acc, card) => {
    if (!card?.id) return acc
    acc[card.id] = (acc[card.id] || 0) + 1
    return acc
  }, {})

  const repeatedIds = Object.entries(duplicateIds)
    .filter(([, count]) => count > 1)
    .map(([id]) => id)

  if (repeatedIds.length > 0) {
    console.warn(`Hay cartas con id repetido: ${repeatedIds.join(', ')}`)
  }

  cards.forEach((card, index) => {
    const missingFields = REQUIRED_CARD_FIELDS.filter((field) => card?.[field] === undefined || card?.[field] === null || card?.[field] === '')
    if (missingFields.length > 0) {
      console.warn(
        `La carta en la posicion ${index} (${card?.name || card?.id || 'sin nombre'}) tiene campos faltantes: ${missingFields.join(', ')}`
      )
    }
  })
}

export function DeckProvider({ children }) {
  // Mazo barajado (se genera al iniciar partida)
  const [shuffledDeck, setShuffledDeck] = useState([])

  // Todas las cartas disponibles (estático)
  const allCards = cardData

  // Crear y barajar un nuevo mazo
  const createShuffledDeck = useCallback(() => {
    validateCardData(cardData)

    // Duplicamos las cartas para tener un mazo más grande
    // 4 copias de cada carta = total dinamico segun cardData.length
    const fullDeck = []
    for (let i = 0; i < 4; i++) {
      fullDeck.push(...cardData.map((card, index) => ({
        ...card,
        uniqueId: `${card.id || 'card'}_${index}_${i}` // Evita colisiones si se repiten ids
      })))
    }
    const shuffled = shuffleDeck(fullDeck)
    setShuffledDeck(shuffled)
    return shuffled
  }, [])

  // Repartir mano inicial (5 cartas por jugador)
  const dealInitialHand = useCallback((deck = shuffledDeck, cardsPerPlayer = 5) => {
    if (deck.length < cardsPerPlayer * 2) {
      console.warn('No hay suficientes cartas en el mazo')
      return { player1Hand: [], player2Hand: [], remainingDeck: deck }
    }

    const player1Hand = deck.slice(0, cardsPerPlayer)
    const player2Hand = deck.slice(cardsPerPlayer, cardsPerPlayer * 2)
    const remainingDeck = deck.slice(cardsPerPlayer * 2)

    return { player1Hand, player2Hand, remainingDeck }
  }, [shuffledDeck])

  // Robar una carta del mazo
  const drawCard = useCallback((deck, count = 1) => {
    if (deck.length < count) {
      return { drawn: [], remaining: deck }
    }
    const drawn = deck.slice(0, count)
    const remaining = deck.slice(count)
    return { drawn, remaining }
  }, [])

  // Reiniciar el mazo
  const resetDeck = useCallback(() => {
    setShuffledDeck([])
  }, [])

  const value = {
    // Estado
    allCards,
    shuffledDeck,
    // Acciones
    createShuffledDeck,
    dealInitialHand,
    drawCard,
    resetDeck
  }

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  )
}

export function useDeck() {
  const context = useContext(DeckContext)
  if (!context) {
    throw new Error('useDeck must be used inside DeckProvider')
  }
  return context
}
