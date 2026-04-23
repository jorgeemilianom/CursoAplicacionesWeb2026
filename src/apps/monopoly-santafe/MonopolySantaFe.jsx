import { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BOARD, COLOR_GROUPS, RAILROAD_IDS, UTILITY_IDS,
  CHANCE_CARDS, COMMUNITY_CARDS,
  PLAYER_COLORS, PLAYER_TOKENS, STARTING_MONEY,
} from './boardData'
import './MonopolySantaFe.css'

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rollDie() { return Math.floor(Math.random() * 6) + 1 }

function ownsColorGroup(player, color) {
  return COLOR_GROUPS[color].every(id => player.properties.includes(id))
}

function countRailroads(player) {
  return RAILROAD_IDS.filter(id => player.properties.includes(id)).length
}

function countUtilities(player) {
  return UTILITY_IDS.filter(id => player.properties.includes(id)).length
}

function calcRent(square, owner, diceSum, buildings) {
  if (square.type === 'railroad') {
    const n = countRailroads(owner)
    return 25 * Math.pow(2, n - 1)
  }
  if (square.type === 'utility') {
    const n = countUtilities(owner)
    return diceSum * (n === 2 ? 10 : 4)
  }
  if (square.type === 'property') {
    const built = buildings[square.id] || 0 // 0-4 = casas, 5 = hotel
    if (built > 0) return square.rent[built]
    // Monopolio completo sin casas = doble alquiler base
    if (ownsColorGroup(owner, square.color)) return square.rent[0] * 2
    return square.rent[0]
  }
  return 0
}

function nearestRailroad(pos) {
  const sorted = [...RAILROAD_IDS].sort((a, b) => {
    const da = (a - pos + 40) % 40
    const db = (b - pos + 40) % 40
    return da - db
  })
  return sorted[0]
}

// ─── SETUP ───────────────────────────────────────────────────────────────────
function buildInitialPlayers(names) {
  return names.map((name, i) => ({
    id: i,
    name,
    color: PLAYER_COLORS[i],
    token: PLAYER_TOKENS[i],
    position: 0,
    money: STARTING_MONEY,
    properties: [],       // square ids
    jailFreeCards: 0,
    inJail: false,
    jailTurns: 0,
    bankrupt: false,
    doublesCount: 0,
  }))
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function MonopolySantaFe() {
  // ── Pantalla de setup ──────────────────────────────────────────────────────
  const [phase, setPhase] = useState('setup') // setup | play | gameover
  const [playerCount, setPlayerCount] = useState(2)
  const [playerNames, setPlayerNames] = useState(['Jugador 1','Jugador 2','Jugador 3','Jugador 4'])

  // ── Estado del juego ───────────────────────────────────────────────────────
  const [players, setPlayers] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [dice, setDice] = useState([1, 1])
  const [rolled, setRolled] = useState(false)
  const [buildings, setBuildings] = useState({}) // { squareId: 0-5 }
  const [log, setLog] = useState([])
  const [modal, setModal] = useState(null) // null | { type, data }
  const [chancesDeck, setChancesDeck]   = useState(() => shuffle(CHANCE_CARDS))
  const [commDeck, setCommDeck]         = useState(() => shuffle(COMMUNITY_CARDS))
  const [winner, setWinner] = useState(null)
  const [parkingPot, setParkingPot] = useState(0) // dinero acumulado en estacionamiento
  const [diceRolling, setDiceRolling] = useState(false)
  const [visualDice, setVisualDice] = useState([1, 1])
  const rollIntervalRef = useRef(null)
  const [walkingState, setWalkingState] = useState(null) // { pidx, pos }
  const walkIntervalRef = useRef(null)

  // ─── helpers de log ────────────────────────────────────────────────────────
  const addLog = useCallback((msg) => {
    setLog(prev => [msg, ...prev].slice(0, 30))
  }, [])

  useEffect(() => {
    return () => {
      clearInterval(rollIntervalRef.current)
      clearInterval(walkIntervalRef.current)
    }
  }, [])

  // ─── INICIO ────────────────────────────────────────────────────────────────
  function startGame() {
    const names = playerNames.slice(0, playerCount)
    setPlayers(buildInitialPlayers(names))
    setBuildings({})
    setLog([])
    setCurrentIdx(0)
    setRolled(false)
    setDice([1, 1])
    setModal(null)
    setWinner(null)
    setParkingPot(0)
    setChancesDeck(shuffle(CHANCE_CARDS))
    setCommDeck(shuffle(COMMUNITY_CARDS))
    setPhase('play')
  }

  // ─── MOVER JUGADOR ─────────────────────────────────────────────────────────
  function movePlayer(playersSnap, pidx, steps, forcePos = null) {
    const p = playersSnap[pidx]
    const oldPos = p.position
    const newPos = forcePos !== null ? forcePos : (oldPos + steps) % 40
    const passedGo = forcePos === null && newPos < oldPos && steps > 0

    let updated = playersSnap.map((pl, i) => {
      if (i !== pidx) return pl
      return {
        ...pl,
        position: newPos,
        money: pl.money + (passedGo ? 200 : 0),
      }
    })
    if (passedGo) addLog(`${p.name} pasó por la Salida. Cobró $200.`)
    return { updated, newPos }
  }

  // ─── LANZAR DADOS ──────────────────────────────────────────────────────────
  function handleRoll() {
    if (rolled || diceRolling) return
    setDiceRolling(true)

    const d1 = rollDie(), d2 = rollDie()
    let count = 0

    rollIntervalRef.current = setInterval(() => {
      count++
      if (count < 8) {
        setVisualDice([rollDie(), rollDie()])
      } else {
        clearInterval(rollIntervalRef.current)
        setVisualDice([d1, d2])
        setDice([d1, d2])
        setDiceRolling(false)
        processRoll(d1, d2)
      }
    }, 80)
  }

  function animateWalk(pidx, startPos, steps, onComplete) {
    let step = 0
    setWalkingState({ pidx, pos: startPos })
    walkIntervalRef.current = setInterval(() => {
      step++
      const pos = (startPos + step) % 40
      setWalkingState({ pidx, pos })
      if (step >= steps) {
        clearInterval(walkIntervalRef.current)
        setTimeout(() => {
          setWalkingState(null)
          onComplete()
        }, 250)
      }
    }, 120)
  }

  function processRoll(d1, d2) {
    const isDouble = d1 === d2
    const sum = d1 + d2
    let snap = [...players]
    const p = snap[currentIdx]

    // ── Cárcel ─────────────────────────────────────────────────────────────
    if (p.inJail) {
      if (isDouble) {
        snap = snap.map((pl, i) => i === currentIdx
          ? { ...pl, inJail: false, jailTurns: 0, doublesCount: 0 }
          : pl)
        addLog(`${p.name} sacó dobles y salió de la cárcel.`)
        // cae a movimiento normal
      } else {
        const newTurns = p.jailTurns + 1
        if (newTurns >= 3) {
          snap = snap.map((pl, i) => i === currentIdx
            ? { ...pl, inJail: false, jailTurns: 0, money: pl.money - 50 }
            : pl)
          addLog(`${p.name} pagó $50 y salió de la cárcel.`)
          // cae a movimiento normal
        } else {
          snap = snap.map((pl, i) => i === currentIdx
            ? { ...pl, jailTurns: newTurns }
            : pl)
          addLog(`${p.name} sigue en la cárcel (turno ${newTurns}/3).`)
          setPlayers(snap)
          setRolled(true)
          return
        }
      }
    } else {
      // ── Dobles triple → ir a la cárcel ──────────────────────────────────
      const newDoubles = isDouble ? p.doublesCount + 1 : 0
      if (newDoubles >= 3) {
        addLog(`${p.name} sacó dobles 3 veces. ¡Va a la cárcel!`)
        const startPos = snap[currentIdx].position
        const snapBeforeJail = snap.map((pl, i) => i === currentIdx
          ? { ...pl, doublesCount: 0 }
          : pl)
        animateWalk(currentIdx, startPos, (10 - startPos + 40) % 40 || 40, () => {
          const jailed = snapBeforeJail.map((pl, i) => i === currentIdx
            ? { ...pl, inJail: true, jailTurns: 0, doublesCount: 0, position: 10 }
            : pl)
          setPlayers(jailed)
          setRolled(true)
        })
        return
      }
      snap = snap.map((pl, i) => i === currentIdx
        ? { ...pl, doublesCount: newDoubles }
        : pl)
    }

    // ── Movimiento paso a paso ───────────────────────────────────────────
    const startPos = snap[currentIdx].position
    const newPos = (startPos + sum) % 40
    const passedGo = newPos < startPos

    // Hacemos una copia de snap para el closure del callback
    const snapAtRoll = snap

    animateWalk(currentIdx, startPos, sum, () => {
      // Aplicar posición final y cobro de salida
      let finalSnap = snapAtRoll.map((pl, i) => i === currentIdx
        ? { ...pl, position: newPos, money: pl.money + (passedGo ? 200 : 0) }
        : pl)
      if (passedGo) addLog(`${p.name} pasó por la Salida. Cobró $200.`)
      addLog(`${p.name} tiró ${d1}+${d2}=${sum} → ${BOARD[newPos].name}`)

      finalSnap = applySquare(finalSnap, currentIdx, newPos, sum, isDouble)
      setPlayers(finalSnap)
      setRolled(!isDouble)
      checkBankruptcyAndWin(finalSnap)
    })
  }

  // ─── APLICAR EFECTO DE CASILLA ─────────────────────────────────────────────
  function applySquare(snap, pidx, pos, diceSum, isDouble) {
    const square = BOARD[pos]
    const p = snap[pidx]

    if (square.type === 'go') return snap
    if (square.type === 'parking') {
      if (parkingPot > 0) {
        addLog(`${p.name} cobró el pozo del estacionamiento: $${parkingPot}`)
        snap = snap.map((pl, i) => i === pidx ? { ...pl, money: pl.money + parkingPot } : pl)
        setParkingPot(0)
      } else {
        addLog(`${p.name} está en Estacionamiento Libre.`)
      }
      return snap
    }
    if (square.type === 'gotojail') {
      addLog(`${p.name} va directo a la Cárcel.`)
      return snap.map((pl, i) => i === pidx
        ? { ...pl, position: 10, inJail: true, jailTurns: 0 }
        : pl)
    }
    if (square.type === 'jail') return snap // solo visita
    if (square.type === 'tax') {
      addLog(`${p.name} pagó impuesto: $${square.amount}`)
      setParkingPot(prev => prev + square.amount)
      return snap.map((pl, i) => i === pidx ? { ...pl, money: pl.money - square.amount } : pl)
    }
    if (square.type === 'chance') {
      const card = chancesDeck[0]
      setChancesDeck(prev => [...prev.slice(1), card])
      addLog(`${p.name} sacó Suerte: "${card.text}"`)
      return applyCard(snap, pidx, card.action, diceSum)
    }
    if (square.type === 'community') {
      const card = commDeck[0]
      setCommDeck(prev => [...prev.slice(1), card])
      addLog(`${p.name} sacó Comunidad: "${card.text}"`)
      return applyCard(snap, pidx, card.action, diceSum)
    }
    if (square.type === 'property' || square.type === 'railroad' || square.type === 'utility') {
      const ownerId = findOwner(snap, pos)
      if (ownerId === null) {
        // Nadie la tiene: ofrecer compra
        setTimeout(() => setModal({ type: 'buy', squareId: pos }), 100)
        return snap
      }
      if (ownerId === pidx) {
        addLog(`${p.name} está en su propia propiedad.`)
        return snap
      }
      // Pagar alquiler
      const owner = snap[ownerId]
      const rent = calcRent(square, owner, diceSum, buildings)
      addLog(`${p.name} pagó $${rent} de alquiler a ${owner.name} (${square.name})`)
      return snap.map((pl, i) => {
        if (i === pidx)   return { ...pl, money: pl.money - rent }
        if (i === ownerId) return { ...pl, money: pl.money + rent }
        return pl
      })
    }
    return snap
  }

  function findOwner(snap, squareId) {
    const idx = snap.findIndex(p => !p.bankrupt && p.properties.includes(squareId))
    return idx === -1 ? null : idx
  }

  // ─── APLICAR CARTA ────────────────────────────────────────────────────────
  function applyCard(snap, pidx, action, diceSum) {
    const p = snap[pidx]
    switch (action.type) {
      case 'gain':
        return snap.map((pl, i) => i === pidx ? { ...pl, money: pl.money + action.amount } : pl)
      case 'pay':
        setParkingPot(prev => prev + action.amount)
        return snap.map((pl, i) => i === pidx ? { ...pl, money: pl.money - action.amount } : pl)
      case 'moveTo': {
        const passedGo = action.to < p.position && action.collect !== false
        const gain = (action.collect || passedGo) ? 200 : 0
        let updated = snap.map((pl, i) => i === pidx ? { ...pl, position: action.to, money: pl.money + gain } : pl)
        if (gain) addLog(`${p.name} pasó por la Salida. Cobró $200.`)
        return applySquare(updated, pidx, action.to, diceSum, false)
      }
      case 'moveBack': {
        const newPos = (p.position - action.steps + 40) % 40
        let updated = snap.map((pl, i) => i === pidx ? { ...pl, position: newPos } : pl)
        return applySquare(updated, pidx, newPos, diceSum, false)
      }
      case 'nearestRailroad': {
        const dest = nearestRailroad(p.position)
        let updated = snap.map((pl, i) => i === pidx ? { ...pl, position: dest } : pl)
        return applySquare(updated, pidx, dest, diceSum, false)
      }
      case 'goToJail':
        return snap.map((pl, i) => i === pidx
          ? { ...pl, position: 10, inJail: true, jailTurns: 0 }
          : pl)
      case 'jailFree':
        return snap.map((pl, i) => i === pidx ? { ...pl, jailFreeCards: pl.jailFreeCards + 1 } : pl)
      case 'collectFromAll': {
        const total = action.amount * (snap.filter(pl => !pl.bankrupt && pl.id !== pidx).length)
        return snap.map((pl, i) => {
          if (pl.bankrupt) return pl
          if (i === pidx) return { ...pl, money: pl.money + total }
          return { ...pl, money: pl.money - action.amount }
        })
      }
      case 'repairs': {
        let cost = 0
        p.properties.forEach(id => {
          const b = buildings[id] || 0
          if (b === 5) cost += action.hotel
          else cost += b * action.house
        })
        return snap.map((pl, i) => i === pidx ? { ...pl, money: pl.money - cost } : pl)
      }
      default: return snap
    }
  }

  // ─── COMPRAR PROPIEDAD ────────────────────────────────────────────────────
  function handleBuy() {
    const squareId = modal.squareId
    const square = BOARD[squareId]
    setPlayers(prev => prev.map((pl, i) => {
      if (i !== currentIdx) return pl
      return { ...pl, money: pl.money - square.price, properties: [...pl.properties, squareId] }
    }))
    addLog(`${players[currentIdx].name} compró ${square.name} por $${square.price}`)
    setModal(null)
  }

  // ─── CONSTRUIR ────────────────────────────────────────────────────────────
  function handleBuild(squareId, action) {
    const square = BOARD[squareId]
    const current = buildings[squareId] || 0
    const p = players[currentIdx]

    if (action === 'buy') {
      if (current >= 5) return
      // Verificar construcción pareja
      const groupIds = COLOR_GROUPS[square.color]
      const maxBuilt = Math.max(...groupIds.map(id => buildings[id] || 0))
      if (current >= maxBuilt && current < 4) {
        // ok, podemos construir aquí
      } else if (current < maxBuilt) {
        // ok
      } else if (current === 4) {
        // construir hotel
      } else {
        addLog('Debés construir de forma pareja.')
        return
      }
      setBuildings(prev => ({ ...prev, [squareId]: current + 1 }))
      setPlayers(prev => prev.map((pl, i) => i === currentIdx ? { ...pl, money: pl.money - square.houseCost } : pl))
      addLog(`${p.name} construyó ${current + 1 === 5 ? 'un hotel' : 'una casa'} en ${square.name}.`)
    } else {
      // vender
      if (current === 0) return
      const refund = Math.floor(square.houseCost / 2)
      setBuildings(prev => ({ ...prev, [squareId]: current - 1 }))
      setPlayers(prev => prev.map((pl, i) => i === currentIdx ? { ...pl, money: pl.money + refund } : pl))
      addLog(`${p.name} vendió construcción en ${square.name}. Cobró $${refund}.`)
    }
  }

  // ─── SALIR DE LA CÁRCEL ───────────────────────────────────────────────────
  function handlePayJail() {
    const p = players[currentIdx]
    if (p.money < 50) { addLog('No tenés dinero suficiente.'); return }
    setPlayers(prev => prev.map((pl, i) => i === currentIdx
      ? { ...pl, inJail: false, jailTurns: 0, money: pl.money - 50 }
      : pl))
    addLog(`${p.name} pagó $50 y salió de la cárcel.`)
  }

  function handleJailFreeCard() {
    const p = players[currentIdx]
    if (p.jailFreeCards === 0) return
    setPlayers(prev => prev.map((pl, i) => i === currentIdx
      ? { ...pl, inJail: false, jailTurns: 0, jailFreeCards: pl.jailFreeCards - 1 }
      : pl))
    addLog(`${p.name} usó carta "Salí de la Cárcel Gratis".`)
  }

  // ─── TERMINAR TURNO ───────────────────────────────────────────────────────
  function handleEndTurn() {
    setRolled(false)
    setDice([1, 1])
    setModal(null)

    // Siguiente jugador activo
    let next = (currentIdx + 1) % players.length
    while (players[next].bankrupt && next !== currentIdx) {
      next = (next + 1) % players.length
    }
    setCurrentIdx(next)
    setPlayers(prev => prev.map((pl, i) => i === next ? { ...pl, doublesCount: 0 } : pl))
  }

  // ─── BANCARROTA ───────────────────────────────────────────────────────────
  function checkBankruptcyAndWin(snap) {
    const active = snap.filter(p => !p.bankrupt)
    const broke = active.filter(p => p.money < 0)
    if (broke.length === 0) return

    let updated = snap.map(p => {
      if (p.money < 0) {
        addLog(`${p.name} está en bancarrota y queda eliminado.`)
        return { ...p, bankrupt: true }
      }
      return p
    })
    setPlayers(updated)

    const survivors = updated.filter(p => !p.bankrupt)
    if (survivors.length === 1) {
      setWinner(survivors[0])
      setPhase('gameover')
    }
  }

  // ─── RENDERIZADO DEL TABLERO ───────────────────────────────────────────────
  // Mapeo de cada casillero a su posición en la grilla 11x11
  // Esquinas: (row,col) → square id
  // sq 0  = fila 11, col 1  (esquina inf-izq)
  // sq 10 = fila 11, col 11 (esquina inf-der)
  // sq 20 = fila 1,  col 11 (esquina sup-der)
  // sq 30 = fila 1,  col 1  (esquina sup-izq)
  function squareGridPos(id) {
    if (id === 0)  return { row: 11, col: 1 }
    if (id === 10) return { row: 11, col: 11 }
    if (id === 20) return { row: 1,  col: 11 }
    if (id === 30) return { row: 1,  col: 1 }
    if (id >= 1  && id <= 9)  return { row: 11, col: id + 1 }       // inferior
    if (id >= 11 && id <= 19) return { row: 11 - (id - 10), col: 11 } // derecha
    if (id >= 21 && id <= 29) return { row: 1, col: 11 - (id - 20) }  // superior
    if (id >= 31 && id <= 39) return { row: id - 29, col: 1 }         // izquierda
    return { row: 1, col: 1 }
  }

  function squareSide(id) {
    if ([0,10,20,30].includes(id)) return 'corner'
    if (id >= 1  && id <= 9)  return 'bottom'
    if (id >= 11 && id <= 19) return 'right'
    if (id >= 21 && id <= 29) return 'top'
    if (id >= 31 && id <= 39) return 'left'
  }

  const colorMap = {
    brown:'#8B4513', lightblue:'#87CEEB', pink:'#FF69B4',
    orange:'#FFA500', red:'#e74c3c', yellow:'#FFD700',
    green:'#2ecc71', darkblue:'#2c3e50',
  }

  function squareTypeIcon(sq) {
    if (sq.type === 'go')       return '🏁'
    if (sq.type === 'jail')     return '🔒'
    if (sq.type === 'gotojail') return '👮'
    if (sq.type === 'parking')  return '🅿️'
    if (sq.type === 'tax')      return '💸'
    if (sq.type === 'chance')   return '❓'
    if (sq.type === 'community')return '📬'
    if (sq.type === 'railroad') return '🛣️'
    if (sq.type === 'utility')  return '⚙️'
    return ''
  }

  function playersOnSquare(id) {
    return players.filter(p => {
      if (p.bankrupt) return false
      if (walkingState && walkingState.pidx === p.id) return walkingState.pos === id
      return p.position === id
    })
  }

  function buildingDisplay(id) {
    const b = buildings[id] || 0
    if (b === 0) return null
    if (b === 5) return <span className="msf-hotel">H</span>
    return <span className="msf-houses">{'🏠'.repeat(b)}</span>
  }

  // ─── PANTALLA SETUP ───────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="msf-setup">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>
        <div className="msf-setup__box">
          <div className="msf-setup__logo">🏙️</div>
          <h1>Monopoly Santa Fe</h1>
          <p>Comprá propiedades de la región, construí casas y hoteles, ¡y llevá a todos a la bancarrota!</p>

          <div className="msf-setup__field">
            <label>Cantidad de jugadores</label>
            <div className="msf-setup__count-btns">
              {[2,3,4].map(n => (
                <button
                  key={n}
                  className={`msf-setup__count-btn ${playerCount === n ? 'active' : ''}`}
                  onClick={() => setPlayerCount(n)}
                >{n}</button>
              ))}
            </div>
          </div>

          {Array.from({ length: playerCount }).map((_, i) => (
            <div key={i} className="msf-setup__player">
              <span className="msf-setup__token" style={{ background: PLAYER_COLORS[i] }}>
                {PLAYER_TOKENS[i]}
              </span>
              <input
                value={playerNames[i]}
                onChange={e => {
                  const arr = [...playerNames]
                  arr[i] = e.target.value
                  setPlayerNames(arr)
                }}
                maxLength={16}
                placeholder={`Jugador ${i + 1}`}
              />
            </div>
          ))}

          <button className="msf-setup__start" onClick={startGame}>
            ¡Empezar juego!
          </button>
        </div>
      </div>
    )
  }

  // ─── PANTALLA GAME OVER ───────────────────────────────────────────────────
  if (phase === 'gameover') {
    return (
      <div className="msf-setup">
        <div className="msf-setup__box msf-gameover">
          <div className="msf-setup__logo">🏆</div>
          <h1>¡{winner?.name} ganó!</h1>
          <p>Sos el dueño absoluto de Santa Fe y la región.</p>
          <button className="msf-setup__start" onClick={() => setPhase('setup')}>
            Jugar de nuevo
          </button>
        </div>
      </div>
    )
  }

  // ─── JUEGO ────────────────────────────────────────────────────────────────
  const currentPlayer = players[currentIdx]
  const activePlayers = players.filter(p => !p.bankrupt)

  return (
    <div className="msf-game">
      {/* ── TABLERO ─────────────────────────────────────────────────────────── */}
      <div className="msf-board-wrap">
        <div className="msf-board">
          {BOARD.map(sq => {
            const { row, col } = squareGridPos(sq.id)
            const side = squareSide(sq.id)
            const isCorner = side === 'corner'
            const onSquare = playersOnSquare(sq.id)
            const owner = players.find(p => p.properties.includes(sq.id))

            return (
              <div
                key={sq.id}
                className={`msf-sq msf-sq--${side} ${owner ? 'msf-sq--owned' : ''}`}
                style={{ gridRow: row, gridColumn: col }}
              >
                {sq.color && (
                  <div className="msf-sq__color-bar" style={{ background: colorMap[sq.color] }} />
                )}
                {!sq.color && (
                  <div className="msf-sq__icon">{squareTypeIcon(sq)}</div>
                )}
                <div className="msf-sq__name">{sq.name}</div>
                {sq.price && <div className="msf-sq__price">${sq.price}</div>}
                {buildingDisplay(sq.id)}
                {owner && !isCorner && (
                  <div className="msf-sq__owner-dot" style={{ background: owner.color }} />
                )}
                {onSquare.length > 0 && (
                  <div className="msf-sq__tokens">
                    {onSquare.map(p => (
                      <span
                        key={p.id}
                        className={`msf-token ${walkingState && walkingState.pidx === p.id ? 'msf-token--walking' : ''}`}
                        style={{ background: p.color }}
                        title={p.name}
                      >
                        {p.token}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Centro del tablero */}
          <div className="msf-board__center">
            <div className="msf-board__center-logo">🏙️</div>
            <div className="msf-board__center-title">Monopoly</div>
            <div className="msf-board__center-sub">Santa Fe</div>
            {parkingPot > 0 && (
              <div className="msf-board__pot">🅿️ Pozo: ${parkingPot}</div>
            )}
          </div>
        </div>
      </div>

      {/* ── PANEL LATERAL ───────────────────────────────────────────────────── */}
      <div className="msf-panel">

        {/* Jugadores */}
        <div className="msf-panel__players">
          {players.map((p, i) => (
            <div
              key={p.id}
              className={`msf-pcard ${i === currentIdx ? 'msf-pcard--active' : ''} ${p.bankrupt ? 'msf-pcard--bankrupt' : ''}`}
            >
              <span className="msf-pcard__token" style={{ background: p.color }}>{p.token}</span>
              <div className="msf-pcard__info">
                <strong>{p.name}</strong>
                <span>${p.money}</span>
              </div>
              {p.inJail && <span className="msf-pcard__jail">🔒 Cárcel</span>}
              {p.bankrupt && <span className="msf-pcard__bankrupt">Eliminado</span>}
            </div>
          ))}
        </div>

        {/* Turno actual */}
        <div className="msf-panel__turn">
          <div className="msf-turn__header">
            <span className="msf-turn__token" style={{ background: currentPlayer.color }}>
              {currentPlayer.token}
            </span>
            <span>Turno de <strong>{currentPlayer.name}</strong></span>
          </div>
          <div className="msf-turn__pos">
            📍 {BOARD[currentPlayer.position].name}
          </div>

          {/* Dados */}
          <div className="msf-dice-row">
            <div className={`msf-die ${diceRolling ? 'msf-die--rolling' : rolled ? 'msf-die--settled' : ''}`}>
              {['','⚀','⚁','⚂','⚃','⚄','⚅'][visualDice[0]]}
            </div>
            <div className={`msf-die ${diceRolling ? 'msf-die--rolling' : rolled ? 'msf-die--settled' : ''}`}>
              {['','⚀','⚁','⚂','⚃','⚄','⚅'][visualDice[1]]}
            </div>
            {dice[0] === dice[1] && rolled && !diceRolling && (
              <span className="msf-doubles">¡Dobles!</span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="msf-actions">
            {/* En cárcel sin haber tirado */}
            {currentPlayer.inJail && !rolled && (
              <>
                <button className="msf-btn msf-btn--secondary" onClick={handlePayJail}>
                  Pagar $50
                </button>
                {currentPlayer.jailFreeCards > 0 && (
                  <button className="msf-btn msf-btn--secondary" onClick={handleJailFreeCard}>
                    Usar carta libre
                  </button>
                )}
              </>
            )}

            {/* Tirar dados */}
            {!rolled && (
              <button className="msf-btn msf-btn--primary" onClick={handleRoll} disabled={diceRolling || walkingState !== null}>
                {diceRolling ? '🎲 Tirando...' : walkingState ? '🎲 Moviendo...' : '🎲 Tirar dados'}
              </button>
            )}

            {/* Construir */}
            {rolled && !walkingState && (
              <button
                className="msf-btn msf-btn--build"
                onClick={() => setModal({ type: 'build' })}
              >
                🏠 Construir / Vender
              </button>
            )}

            {/* Terminar turno */}
            {rolled && !walkingState && (
              <button className="msf-btn msf-btn--end" onClick={handleEndTurn}>
                Terminar turno →
              </button>
            )}
          </div>
        </div>

        {/* Log */}
        <div className="msf-log">
          <div className="msf-log__title">Historial</div>
          {log.map((entry, i) => (
            <div key={i} className="msf-log__entry">{entry}</div>
          ))}
        </div>
      </div>

      {/* ── MODAL COMPRAR ───────────────────────────────────────────────────── */}
      {modal?.type === 'buy' && (() => {
        const sq = BOARD[modal.squareId]
        const canBuy = currentPlayer.money >= sq.price
        return (
          <div className="msf-overlay" onClick={() => setModal(null)}>
            <div className="msf-modal" onClick={e => e.stopPropagation()}>
              {sq.color && (
                <div className="msf-modal__color-bar" style={{ background: colorMap[sq.color] }} />
              )}
              <h2>{sq.name}</h2>
              <div className="msf-modal__detail">Precio: <strong>${sq.price}</strong></div>
              {sq.rent && (
                <div className="msf-modal__rents">
                  <div>Alquiler base: ${sq.rent[0]}</div>
                  <div>Con 1 casa: ${sq.rent[1]}</div>
                  <div>Con 2 casas: ${sq.rent[2]}</div>
                  <div>Con 3 casas: ${sq.rent[3]}</div>
                  <div>Con 4 casas: ${sq.rent[4]}</div>
                  <div>Hotel: ${sq.rent[5]}</div>
                  {sq.houseCost && <div>Costo por casa/hotel: ${sq.houseCost}</div>}
                </div>
              )}
              {sq.type === 'railroad' && (
                <div className="msf-modal__rents">
                  <div>1 ruta: $25</div>
                  <div>2 rutas: $50</div>
                  <div>3 rutas: $100</div>
                  <div>4 rutas: $200</div>
                </div>
              )}
              {sq.type === 'utility' && (
                <div className="msf-modal__rents">
                  <div>1 servicio: 4x dados</div>
                  <div>2 servicios: 10x dados</div>
                </div>
              )}
              <div className="msf-modal__btns">
                {canBuy ? (
                  <button className="msf-btn msf-btn--primary" onClick={handleBuy}>
                    Comprar por ${sq.price}
                  </button>
                ) : (
                  <div className="msf-modal__cant">No tenés suficiente dinero.</div>
                )}
                <button className="msf-btn msf-btn--secondary" onClick={() => setModal(null)}>
                  No comprar
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── MODAL CONSTRUIR ─────────────────────────────────────────────────── */}
      {modal?.type === 'build' && (
        <div className="msf-overlay" onClick={() => setModal(null)}>
          <div className="msf-modal msf-modal--build" onClick={e => e.stopPropagation()}>
            <h2>Construir / Vender</h2>
            {(() => {
              const buildableProps = currentPlayer.properties.filter(id => {
                const sq = BOARD[id]
                return sq.type === 'property' && ownsColorGroup(currentPlayer, sq.color)
              })
              if (buildableProps.length === 0) {
                return <p className="msf-modal__empty">No tenés grupos completos para construir.</p>
              }
              return buildableProps.map(id => {
                const sq = BOARD[id]
                const built = buildings[id] || 0
                return (
                  <div key={id} className="msf-build-row">
                    <div className="msf-build-row__color" style={{ background: colorMap[sq.color] }} />
                    <div className="msf-build-row__name">{sq.name}</div>
                    <div className="msf-build-row__status">
                      {built === 0 ? 'Sin casas' : built < 5 ? `${built} 🏠` : '🏨 Hotel'}
                    </div>
                    <div className="msf-build-row__btns">
                      {built < 5 && (
                        <button
                          className="msf-btn msf-btn--small"
                          disabled={currentPlayer.money < sq.houseCost}
                          onClick={() => handleBuild(id, 'buy')}
                        >
                          +${sq.houseCost}
                        </button>
                      )}
                      {built > 0 && (
                        <button
                          className="msf-btn msf-btn--small msf-btn--sell"
                          onClick={() => handleBuild(id, 'sell')}
                        >
                          Vender
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            })()}
            <button className="msf-btn msf-btn--end" style={{marginTop:'1rem'}} onClick={() => setModal(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
