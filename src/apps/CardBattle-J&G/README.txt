
Vamos a construir juntos un juego de cartas tipo duelo (Card Battle) en React.
Antes de escribir código, quiero que entiendas el contexto completo del proyecto.

---

## CONTEXTO DEL DESARROLLADOR

Soy estudiante de React avanzado. Mi proyecto anterior fue un juego de 
rompecabezas (Mario Galaxy) donde aprendí:
- React Context API con múltiples contextos separados por responsabilidad
- Custom Hooks con validación (throw Error si se usan fuera del Provider)
- Contextos anidados donde uno consume a otro (PuzzleContext usaba useConfig)
- Drag & Drop nativo

Quiero mantener exactamente ese mismo estilo de arquitectura en este proyecto.

---

## CONVENCIONES QUE DEBO MANTENER (MUY IMPORTANTE)

### Estructura de carpetas:
card-battle/
├── ArchivosCSS/
├── ArchivosJS/
│   ├── useCardGame.js       ← custom hook principal con la lógica del juego
│   └── cardData.js          ← datos estáticos de todas las cartas
├── ArchivosJSX/
│   ├── context/
│   │   ├── DeckContext.jsx
│   │   ├── BattleContext.jsx
│   │   └── GameContext.jsx
│   ├── screens/
│   │   ├── MenuScreen.jsx
│   │   ├── GameScreen.jsx
│   │   └── ResultScreen.jsx
│   ├── card/
│   │   ├── Card.jsx
│   │   ├── CardFront.jsx
│   │   ├── CardBack.jsx
│   │   └── CardEffect.jsx
│   ├── battle/
│   │   ├── BattleBoard.jsx
│   │   ├── PlayerZone.jsx
│   │   ├── BattleField.jsx
│   │   └── SlotCard.jsx
│   ├── hand/
│   │   ├── PlayerHand.jsx
│   │   ├── DeckPile.jsx
│   │   └── DiscardPile.jsx
│   └── hud/
│       ├── PlayerStats.jsx
│       ├── HealthBar.jsx
│       ├── TurnIndicator.jsx
│       ├── GameLog.jsx
│       └── EffectNotification.jsx
└── README.md

### Patrón de contextos que SIEMPRE debo seguir:
- createContext(null)
- Custom hook con validación: if (!context) throw new Error(...)
- El hook se llama useDeck(), useBattle(), useGame()
- Los Providers se llaman DeckProvider, BattleProvider, GameProvider

Ejemplo exacto del patrón:
  const DeckContext = createContext(null)
  export function DeckProvider({ children }) { ... }
  export function useDeck() {
    const context = useContext(DeckContext)
    if (!context) throw new Error('useDeck must be used inside DeckProvider')
    return context
  }

---

## EL JUEGO: CARD BATTLE

### Concepto general:
Dos jugadores se turnan para jugar cartas de un mazo compartido.
Cada carta tiene ataque, defensa y un efecto especial.
El objetivo es bajar la vida del oponente a cero.

### Los tres contextos y su responsabilidad:

**DeckContext** (el más estático, similar al ConfigContext del puzzle)
- La biblioteca completa de cartas disponibles
- Función para barajar y repartir mano inicial
- Expone: allCards, shuffledDeck, dealInitialHand()

**BattleContext** (el más dinámico, similar al PuzzleContext del puzzle)
- Consume DeckContext (igual que PuzzleContext consumía ConfigContext)
- Estado de la batalla: mano de cada jugador, cartas en el campo,
  efectos activos, historial de acciones
- Expone: player1Hand, player2Hand, fieldCards, 
  playCard(cardId), drawCard(playerId), activeEffect

**GameContext** (el nuevo, el más global)
- Vidas de cada jugador (empiezan en 20)
- Turno actual (player1 | player2)
- Estado del juego (menu | playing | gameover)
- Ganador
- Expone: player1HP, player2HP, currentTurn, gameStatus, 
  winner, applyDamage(playerId, amount), endTurn(), resetGame()

### Estructura de una carta (cardData.js):
Cada carta debe tener:
- id, name, attack, defense
- effectType: 'damage' | 'heal' | 'shield' | 'draw'
- effectValue: número
- description: string explicando el efecto
- rarity: 'common' | 'rare' | 'legendary'

### Efectos visuales importantes (CSS puro, sin librerías):
1. Volteo 3D de carta: usando perspective, transform-style: preserve-3d,
   backface-visibility: hidden, rotateY(180deg)
2. Mano en abanico: cada carta rota (index - middle) * 8 grados,
   transformOrigin: 'bottom center'
3. Mazo apilado: capas absolutas con top: -i*2px, left: i*2px
4. Hover en carta: translateY(-30px) scale(1.1), z-index alto
5. EffectNotification: aparece centrada en pantalla y desaparece sola

### Jerarquía de Providers en el componente raíz:
<GameProvider>
  <DeckProvider>
    <BattleProvider>
      <App />
    </BattleProvider>
  </DeckProvider>
</GameProvider>

---

## CÓMO QUIERO QUE TRABAJEMOS

1. No generes todo el código de una sola vez.
2. Avancemos archivo por archivo, empezando por la base.
3. Antes de cada archivo, explicame brevemente qué hace y por qué.
4. Respetá siempre las convenciones de carpetas y el patrón de contextos.
5. Si en algún momento algo puede hacerse mejor, sugerímelo antes de hacerlo.

---

## PRIMERA TAREA

Arrancá creando la estructura de carpetas vacía y el archivo cardData.js
con al menos 12 cartas de ejemplo distribuidas en las 3 raridades y los 
4 tipos de efectos. Que los nombres de las cartas sean creativos y temáticos
(fantasía medieval está bien). Cuando termines, esperá mi confirmación 
antes de seguir con los contextos.