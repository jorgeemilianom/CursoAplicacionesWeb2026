import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './ScapeRoom.css'

const roomImage = new URL('../../../Imganes/Nivel 1.1.png', import.meta.url).href
const deskImage = new URL('../../../Imganes/Nivel 1.2.png', import.meta.url).href
const handleImage = new URL('../../../Imganes/Nivel 1.2 manija.png', import.meta.url).href
const fridgeImage = new URL('../../../Imganes/Nivel 1.3.png', import.meta.url).href
const keyImage = new URL('../../../Imganes/Nivel 1.3 llave.png', import.meta.url).href
const briefcaseImage = new URL('../../../Imganes/Nivel 1.4.png', import.meta.url).href
const knobImage = new URL('../../../Imganes/Nivel 1.4 perilla.png', import.meta.url).href
const safeImage = new URL('../../../Imganes/Nivel 1.5.png', import.meta.url).href
const exitImage = new URL('../../../Imganes/Nivel 1.6.png', import.meta.url).href
const levelTwoImage = new URL('../../../Imganes/Nivel2.png', import.meta.url).href

const inventoryConfig = {
  handle: {
    label: 'Manija',
    image: handleImage,
  },
  key: {
    label: 'Llave',
    image: keyImage,
  },
  knob: {
    label: 'Perilla',
    image: knobImage,
  },
}

const keypadButtons = [
  { digit: '1', top: '20%', left: '74%' },
  { digit: '2', top: '31%', left: '85%' },
  { digit: '3', top: '47%', left: '89%' },
  { digit: '4', top: '63%', left: '84%' },
  { digit: '5', top: '76%', left: '73%' },
  { digit: '6', top: '83%', left: '57%' },
  { digit: '7', top: '77%', left: '42%' },
  { digit: '8', top: '63%', left: '31%' },
  { digit: '9', top: '46%', left: '27%' },
  { digit: '0', top: '30%', left: '33%' },
]

const requiredInventory = {
  fridge: 'handle',
  briefcase: 'key',
  safe: 'knob',
}

function ScapeRoom() {
  const audioContextRef = useRef(null)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [overlay, setOverlay] = useState(null)
  const [inventory, setInventory] = useState({
    handle: false,
    key: false,
    knob: false,
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [pendingTarget, setPendingTarget] = useState(null)
  const [safeCode, setSafeCode] = useState('')
  const [safeFeedback, setSafeFeedback] = useState('')
  const [message, setMessage] = useState('Explora la habitación y encuentra la primera pista sobre la mesa.')

  const completed = currentLevel > 1 || overlay === 'exit'

  const getAudioContext = () => {
    if (typeof window === 'undefined') return
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    const context = audioContextRef.current

    return context
  }

  const runWithAudioContext = (callback) => {
    const context = getAudioContext()
    if (!context) return

    if (context.state === 'suspended') {
      context.resume().then(() => {
        callback(context)
      }).catch(() => {})
      return
    }

    callback(context)
  }

  const playPickupSound = () => {
    runWithAudioContext((context) => {
      const now = context.currentTime
      const oscillatorA = context.createOscillator()
      const oscillatorB = context.createOscillator()
      const gainNode = context.createGain()

      oscillatorA.type = 'triangle'
      oscillatorB.type = 'sine'
      oscillatorA.frequency.setValueAtTime(740, now)
      oscillatorB.frequency.setValueAtTime(1110, now)

      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.16, now + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

      oscillatorA.connect(gainNode)
      oscillatorB.connect(gainNode)
      gainNode.connect(context.destination)

      oscillatorA.start(now)
      oscillatorB.start(now + 0.015)
      oscillatorA.stop(now + 0.2)
      oscillatorB.stop(now + 0.22)
    })
  }

  const playErrorSound = () => {
    runWithAudioContext((context) => {
      const now = context.currentTime
      const oscillator = context.createOscillator()
      const gainNode = context.createGain()

      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(320, now)
      oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.28)

      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.start(now)
      oscillator.stop(now + 0.3)
    })
  }

  const playDoorOpenSound = () => {
    runWithAudioContext((context) => {
      const now = context.currentTime
      const oscillatorA = context.createOscillator()
      const oscillatorB = context.createOscillator()
      const gainNode = context.createGain()
      const filter = context.createBiquadFilter()

      oscillatorA.type = 'triangle'
      oscillatorB.type = 'sine'
      oscillatorA.frequency.setValueAtTime(180, now)
      oscillatorA.frequency.linearRampToValueAtTime(260, now + 0.6)
      oscillatorB.frequency.setValueAtTime(90, now)
      oscillatorB.frequency.linearRampToValueAtTime(130, now + 0.6)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, now)

      gainNode.gain.setValueAtTime(0.0001, now)
      gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.04)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.75)

      oscillatorA.connect(filter)
      oscillatorB.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(context.destination)

      oscillatorA.start(now)
      oscillatorB.start(now)
      oscillatorA.stop(now + 0.75)
      oscillatorB.stop(now + 0.75)
    })
  }

  const openOverlay = (nextOverlay) => {
    setOverlay(nextOverlay)
    setPendingTarget(null)

    if (nextOverlay === 'desk') {
      setMessage('Observa la mesa. La manija es la pieza que necesitas para intervenir la heladera.')
    }

    if (nextOverlay === 'fridge') {
      setMessage('La heladera está abierta. Busca una llave entre los productos.')
    }

    if (nextOverlay === 'briefcase') {
      setMessage('El maletín se abrió. Toma la perilla para activar la caja fuerte.')
    }

    if (nextOverlay === 'safe') {
      setSafeFeedback('')
      setMessage('La caja fuerte ya está lista. La pista visible en la habitación puede darte la combinación.')
    }

    if (nextOverlay === 'exit') {
      setSafeFeedback('')
      setMessage('La puerta se abrió. Nivel 1 superado.')
    }
  }

  const collectItem = (item) => {
    playPickupSound()
    setInventory((current) => ({ ...current, [item]: true }))
    setSelectedItem(item)
    setMessage(`${inventoryConfig[item].label} obtenida. Úsala en el lugar correcto.`)
  }

  const handleInventoryClick = (item) => {
    if (!inventory[item]) return

    setSelectedItem(item)

    if (pendingTarget && requiredInventory[pendingTarget] === item) {
      if (pendingTarget === 'fridge') openOverlay('fridge')
      if (pendingTarget === 'briefcase') openOverlay('briefcase')
      if (pendingTarget === 'safe') openOverlay('safe')
      return
    }

    setMessage(`${inventoryConfig[item].label} seleccionada.`)
  }

  const requestTargetAction = (target) => {
    if (target === 'desk') {
      openOverlay('desk')
      return
    }

    const neededItem = requiredInventory[target]

    if (!inventory[neededItem]) {
      if (target === 'fridge') {
        setMessage('La heladera no se puede abrir todavía. Primero necesitas encontrar una manija.')
      }

      if (target === 'briefcase') {
        setMessage('El maletín está cerrado. Antes debes conseguir la llave.')
      }

      if (target === 'safe') {
        setMessage('La caja fuerte aún no tiene perilla. Debes encontrarla en el maletín.')
      }
      return
    }

    if (selectedItem === neededItem) {
      if (target === 'fridge') openOverlay('fridge')
      if (target === 'briefcase') openOverlay('briefcase')
      if (target === 'safe') openOverlay('safe')
      return
    }

    setPendingTarget(target)

    if (target === 'fridge') {
      setMessage('Haz clic ahora en la manija del inventario para abrir la heladera.')
    }

    if (target === 'briefcase') {
      setMessage('Haz clic ahora en la llave del inventario para abrir el maletín.')
    }

    if (target === 'safe') {
      setMessage('Haz clic ahora en la perilla del inventario para activar la caja fuerte.')
    }
  }

  const handleSafeDigit = (digit) => {
    const nextCode = `${safeCode}${digit}`.slice(0, 4)
    setSafeCode(nextCode)

    if (nextCode === '2145') {
      setSafeFeedback('')
      playDoorOpenSound()
      openOverlay('exit')
      return
    }

    if (nextCode.length < 4) {
      setSafeFeedback('')
      setMessage(`Combinación parcial: ${nextCode}`)
      return
    }

    setSafeFeedback('Error: vuelve a intentarlo')
    playErrorSound()
    setMessage(`La secuencia ${nextCode} no abre la caja fuerte. Reinicia e inténtalo otra vez.`)
  }

  const resetSafeCode = () => {
    setSafeCode('')
    setSafeFeedback('')
    setMessage('Combinación reiniciada.')
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setOverlay(null)
    setInventory({
      handle: false,
      key: false,
      knob: false,
    })
    setSelectedItem(null)
    setPendingTarget(null)
    setSafeCode('')
    setSafeFeedback('')
    setMessage('Explora la habitación y encuentra la primera pista sobre la mesa.')
  }

  const goToLevelTwo = () => {
    setCurrentLevel(2)
    setOverlay(null)
    setPendingTarget(null)
    setSelectedItem(null)
    setSafeCode('')
    setSafeFeedback('')
    setMessage('Has entrado al nivel 2. La nueva habitación ya está lista para construir su siguiente reto.')
  }

  return (
    <div className="scape-room app-wrapper">
      <div className="scape-room__container">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="app-header">
          <span className="app-modulo">Módulo 05 — React.js</span>
          <h1>Scape-Room</h1>
          <p>
            {currentLevel === 1
              ? 'Nivel 1 del escape room. Explora, recoge objetos y úsalo todo en el orden correcto hasta abrir la puerta.'
              : 'Nivel 2 desbloqueado. La nueva escena ya está visible para seguir construyendo el juego.'}
          </p>
        </header>

        <section className="scape-room__layout">
          <div className="scape-room__board">
            <div className="scape-room__image-frame">
              {currentLevel === 1 ? (
                <>
                  <img
                    src={roomImage}
                    alt="Habitación principal del nivel 1"
                    className="scape-room__room-image"
                  />

                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--desk"
                    onClick={() => requestTargetAction('desk')}
                    aria-label="Revisar la mesa"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--fridge"
                    onClick={() => requestTargetAction('fridge')}
                    aria-label="Abrir la heladera"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--briefcase"
                    onClick={() => requestTargetAction('briefcase')}
                    aria-label="Abrir el maletín"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--safe"
                    onClick={() => requestTargetAction('safe')}
                    aria-label="Abrir la caja fuerte"
                  />
                </>
              ) : (
                <>
                  <img
                    src={levelTwoImage}
                    alt="Habitación del nivel 2"
                    className="scape-room__room-image"
                  />
                  <div className="scape-room__level-badge">Nivel 2</div>
                </>
              )}

              {overlay && (
                <div className="scape-room__overlay">
                  <button
                    type="button"
                    className="scape-room__close"
                    onClick={() => {
                      setOverlay(null)
                      setPendingTarget(null)
                    }}
                    aria-label="Cerrar vista ampliada"
                  >
                    ×
                  </button>

                  {overlay === 'desk' && (
                    <div className="scape-room__overlay-card">
                      <img src={deskImage} alt="Mesa con la manija" className="scape-room__overlay-image" />
                      {!inventory.handle && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--handle"
                          onClick={() => collectItem('handle')}
                          aria-label="Tomar la manija"
                        />
                      )}
                    </div>
                  )}

                  {overlay === 'fridge' && (
                    <div className="scape-room__overlay-card">
                      <img src={fridgeImage} alt="Interior de la heladera" className="scape-room__overlay-image" />
                      {!inventory.key && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--key"
                          onClick={() => collectItem('key')}
                          aria-label="Tomar la llave"
                        />
                      )}
                    </div>
                  )}

                  {overlay === 'briefcase' && (
                    <div className="scape-room__overlay-card">
                      <img src={briefcaseImage} alt="Maletín abierto" className="scape-room__overlay-image" />
                      {!inventory.knob && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--knob"
                          onClick={() => collectItem('knob')}
                          aria-label="Tomar la perilla"
                        />
                      )}
                    </div>
                  )}

                  {overlay === 'safe' && (
                    <div className="scape-room__overlay-card scape-room__overlay-card--safe">
                      <img src={safeImage} alt="Caja fuerte activada" className="scape-room__overlay-image" />
                      <div className="scape-room__safe-ui">
                        {keypadButtons.map((button) => (
                          <button
                            key={button.digit}
                            type="button"
                            className="scape-room__digit"
                            style={{ top: button.top, left: button.left }}
                            onClick={() => handleSafeDigit(button.digit)}
                          >
                            {button.digit}
                          </button>
                        ))}
                        <div className="scape-room__safe-display">{safeCode || '----'}</div>
                        {safeFeedback && (
                          <div className="scape-room__safe-feedback">{safeFeedback}</div>
                        )}
                        <button
                          type="button"
                          className="scape-room__reset"
                          onClick={resetSafeCode}
                        >
                          Reiniciar
                        </button>
                      </div>
                    </div>
                  )}

                  {overlay === 'exit' && (
                    <div className="scape-room__overlay-card">
                      <img src={exitImage} alt="Puerta abierta del nivel 1" className="scape-room__overlay-image" />
                      <button
                        type="button"
                        className="scape-room__hotspot scape-room__hotspot--exit-door"
                        onClick={goToLevelTwo}
                        aria-label="Pasar al nivel 2"
                      />
                      <div className="scape-room__victory">
                        <h2>Nivel 1 completado</h2>
                        <p>La puerta se abrió. Haz clic sobre la salida para pasar al nivel 2.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="scape-room__sidebar">
            <div className="scape-room__panel">
              <button
                type="button"
                className="scape-room__restart-button"
                onClick={resetGame}
              >
                Reiniciar el juego
              </button>
            </div>

            <div className="scape-room__panel">
              <h2>Inventario</h2>
              {currentLevel === 1 ? (
                <div className="scape-room__inventory">
                  {Object.entries(inventoryConfig).map(([item, config]) => (
                    <button
                      key={item}
                      type="button"
                      className={`scape-room__inventory-item ${inventory[item] ? 'is-active' : 'is-empty'} ${selectedItem === item ? 'is-selected' : ''}`}
                      onClick={() => handleInventoryClick(item)}
                      disabled={!inventory[item]}
                    >
                      {inventory[item] ? (
                        <>
                          <img src={config.image} alt={config.label} />
                          <span>{config.label}</span>
                        </>
                      ) : (
                        <span>Vacío</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p>El inventario del nivel 1 quedó atrás. Desde aquí podemos diseñar las nuevas pistas del nivel 2.</p>
              )}
            </div>

            <div className="scape-room__panel">
              <h2>Estado del juego</h2>
              <p>{message}</p>
              <div className="scape-room__progress">
                <span className={inventory.handle ? 'is-done' : ''}>Manija</span>
                <span className={inventory.key ? 'is-done' : ''}>Llave</span>
                <span className={inventory.knob ? 'is-done' : ''}>Perilla</span>
                <span className={completed ? 'is-done' : ''}>Puerta abierta</span>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default ScapeRoom
