import { createContext, useState, useCallback, useContext } from 'react'
import { cardData, shuffleDeck } from '../../ArchivosJS/cardData'

const DeckContext = createContext(null)

export function DeckProvider({ children }) {
  // Mazo barajado (se genera al iniciar partida)
  const [shuffledDeck, setShuffledDeck] = useState([])

  // Todas las cartas disponibles (estático)
  const allCards = cardData

  // Crear y barajar un nuevo mazo
  const createShuffledDeck = useCallback(() => {
    // Duplicamos las cartas para tener un mazo más grande
    // 4 copias de cada carta = 48 cartas total
    const fullDeck = []
    for (let i = 0; i < 4; i++) {
      fullDeck.push(...cardData.map(card => ({
        ...card,
        uniqueId: `${card.id}_${i}` // ID único para cada copia
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