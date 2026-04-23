import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './ScapeRoom.css'

const roomImage = new URL('./ImgScapeRoom/Nivel 1.1.png', import.meta.url).href
const deskImage = new URL('./ImgScapeRoom/Nivel 1.2.png', import.meta.url).href
const handleImage = new URL('./ImgScapeRoom/Nivel 1.2 manija.png', import.meta.url).href
const fridgeImage = new URL('./ImgScapeRoom/Nivel 1.3.png', import.meta.url).href
const keyImage = new URL('./ImgScapeRoom/Nivel 1.3 llave.png', import.meta.url).href
const briefcaseImage = new URL('./ImgScapeRoom/Nivel 1.4.png', import.meta.url).href
const knobImage = new URL('./ImgScapeRoom/Nivel 1.4 perilla.png', import.meta.url).href
const safeImage = new URL('./ImgScapeRoom/Nivel 1.5.png', import.meta.url).href
const exitImage = new URL('./ImgScapeRoom/Nivel 1.6.png', import.meta.url).href
const levelTwoImage = new URL('./ImgScapeRoom/Nivel2.png', import.meta.url).href
const levelThreeImage = new URL('./ImgScapeRoom/Nivel3.jpg', import.meta.url).href

const levelTwoPlantImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.1 a.png', import.meta.url).href
const levelTwoOpenerImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.1 destapador.png', import.meta.url).href
const levelTwoTableClosedImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.2 a.png', import.meta.url).href
const levelTwoTableOpenImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.2 mesa.png', import.meta.url).href
const levelTwoPaperImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.2 papel (overlay).png', import.meta.url).href
const levelTwoChestImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.3 cofre.png', import.meta.url).href
const levelTwoChestOpenImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.3 cofre_teneza.png', import.meta.url).href
const levelTwoPliersImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.3 tenaza.png', import.meta.url).href
const levelTwoLockImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.4 a.png', import.meta.url).href
const levelTwoUnlockedLockImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.4 candado.png', import.meta.url).href
const levelTwoBookImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.4 libro (overlay).png', import.meta.url).href
const levelTwoShelfImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.5 pon el libro.png', import.meta.url).href
const levelTwoFinalImage = new URL('./ImgScapeRoom/Nivel 2/Nivel 2.6 final.png', import.meta.url).href

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

const levelTwoInventoryConfig = {
  opener: {
    label: 'Destapador',
    image: levelTwoOpenerImage,
  },
  paper: {
    label: 'Papel',
    image: levelTwoPaperImage,
  },
  pliers: {
    label: 'Tenaza',
    image: levelTwoPliersImage,
  },
  book: {
    label: 'Libro',
    image: levelTwoBookImage,
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

const chestButtons = [
  { digit: '1', top: '24%', left: '46%' },
  { digit: '2', top: '24%', left: '52%' },
  { digit: '3', top: '24%', left: '58%' },
  { digit: '4', top: '34%', left: '46%' },
  { digit: '5', top: '34%', left: '52%' },
  { digit: '6', top: '34%', left: '58%' },
  { digit: '7', top: '44%', left: '46%' },
  { digit: '8', top: '44%', left: '52%' },
  { digit: '9', top: '44%', left: '58%' },
  { digit: 'C', top: '54%', left: '46%' },
  { digit: '0', top: '54%', left: '52%' },
  { digit: 'E', top: '54%', left: '58%' },
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

  const [levelTwoInventory, setLevelTwoInventory] = useState({
    opener: false,
    paper: false,
    pliers: false,
    book: false,
  })
  const [levelTwoDraggedItem, setLevelTwoDraggedItem] = useState(null)
  const [levelTwoCode, setLevelTwoCode] = useState('')
  const [levelTwoFeedback, setLevelTwoFeedback] = useState('')
  const [levelTwoTableUnlocked, setLevelTwoTableUnlocked] = useState(false)
  const [levelTwoChestUnlocked, setLevelTwoChestUnlocked] = useState(false)
  const [levelTwoLockUnlocked, setLevelTwoLockUnlocked] = useState(false)
  const [levelTwoShelfSolved, setLevelTwoShelfSolved] = useState(false)
  const [levelThreePreview, setLevelThreePreview] = useState(false)

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
    setLevelTwoInventory({
      opener: false,
      paper: false,
      pliers: false,
      book: false,
    })
    setLevelTwoDraggedItem(null)
    setLevelTwoCode('')
    setLevelTwoFeedback('')
    setLevelTwoTableUnlocked(false)
    setLevelTwoChestUnlocked(false)
    setLevelTwoLockUnlocked(false)
    setLevelTwoShelfSolved(false)
    setLevelThreePreview(false)
    setMessage('Explora la habitación y encuentra la primera pista sobre la mesa.')
  }

  const goToLevelTwo = () => {
    setCurrentLevel(2)
    setOverlay(null)
    setPendingTarget(null)
    setSelectedItem(null)
    setSafeCode('')
    setSafeFeedback('')
    setLevelTwoDraggedItem(null)
    setMessage('Has entrado al nivel 2. La nueva habitación ya está lista para construir su siguiente reto.')
  }

  const resetLevelTwo = () => {
    setCurrentLevel(2)
    setOverlay(null)
    setPendingTarget(null)
    setSelectedItem(null)
    setSafeCode('')
    setSafeFeedback('')
    setLevelTwoInventory({
      opener: false,
      paper: false,
      pliers: false,
      book: false,
    })
    setLevelTwoDraggedItem(null)
    setLevelTwoCode('')
    setLevelTwoFeedback('')
    setLevelTwoTableUnlocked(false)
    setLevelTwoChestUnlocked(false)
    setLevelTwoLockUnlocked(false)
    setLevelTwoShelfSolved(false)
    setLevelThreePreview(false)
    setMessage('Nivel 2 reiniciado. Empieza por revisar la maceta.')
  }

  const collectLevelTwoItem = (item) => {
    if (levelTwoInventory[item]) return
    playPickupSound()
    setLevelTwoInventory((current) => ({ ...current, [item]: true }))
    setLevelTwoDraggedItem(null)
    setMessage(`${levelTwoInventoryConfig[item].label} obtenido. Ahora úsalo donde corresponda.`)
  }

  const openLevelTwoOverlay = (nextOverlay) => {
    setOverlay(nextOverlay)
    setLevelTwoDraggedItem(null)
    setLevelTwoFeedback('')

    if (nextOverlay === 'level2-plant') setMessage('Revisa la maceta. El primer objeto útil del nivel 2 está ahí.')
    if (nextOverlay === 'level2-table-closed') setMessage('La botella sigue cerrada. Arrastra el destapador desde el inventario.')
    if (nextOverlay === 'level2-table-open') setMessage('La botella ya fue abierta. Ahora puedes tomar el papel con el acertijo.')
    if (nextOverlay === 'level2-chest') setMessage('El cofre necesita un código de cuatro dígitos. La respuesta del papel es 1212.')
    if (nextOverlay === 'level2-chest-open') setMessage('El cofre se abrió. Toma la tenaza.')
    if (nextOverlay === 'level2-lock') {
      setMessage(levelTwoLockUnlocked
        ? 'El candado ya fue cortado. Ahora puedes tomar el libro.'
        : 'El candado está cerrado. Arrastra la tenaza para cortarlo.')
    }
    if (nextOverlay === 'level2-shelf') setMessage('Coloca el libro en el espacio vacío del estante para revelar el paso secreto.')
    if (nextOverlay === 'level2-final') setMessage('Nivel 2 superado. Haz clic en el pasillo abierto para ver el nivel 3.')
    if (nextOverlay === 'level3-preview') setMessage('Nivel 3 visible. Próximamente construiremos esta nueva habitación.')
  }

  const handleLevelTwoHotspot = (target) => {
    if (target === 'plant') return openLevelTwoOverlay('level2-plant')
    if (target === 'table') return openLevelTwoOverlay(levelTwoTableUnlocked ? 'level2-table-open' : 'level2-table-closed')
    if (target === 'chest') return openLevelTwoOverlay(levelTwoChestUnlocked ? 'level2-chest-open' : 'level2-chest')
    if (target === 'lock') return openLevelTwoOverlay('level2-lock')
    if (target === 'shelf') return openLevelTwoOverlay(levelTwoShelfSolved ? 'level2-final' : 'level2-shelf')
  }

  const handleLevelTwoDragStart = (item) => {
    setLevelTwoDraggedItem(item)
    setMessage(`Arrastrando ${levelTwoInventoryConfig[item].label.toLowerCase()}.`)
  }

  const handleDropUnlockBottle = (event) => {
    event.preventDefault()
    if (levelTwoDraggedItem !== 'opener') {
      setMessage('Necesitas el destapador para abrir la botella.')
      return
    }
    setLevelTwoTableUnlocked(true)
    openLevelTwoOverlay('level2-table-open')
  }

  const handleDropUnlockLock = (event) => {
    event.preventDefault()
    if (levelTwoDraggedItem !== 'pliers') {
      setMessage('Necesitas la tenaza para cortar el candado.')
      return
    }
    playDoorOpenSound()
    setLevelTwoLockUnlocked(true)
    openLevelTwoOverlay('level2-lock')
  }

  const handleDropShelfBook = (event) => {
    event.preventDefault()
    if (levelTwoDraggedItem !== 'book') {
      setMessage('Necesitas el libro para activar el estante.')
      return
    }
    playDoorOpenSound()
    setLevelTwoShelfSolved(true)
    openLevelTwoOverlay('level2-final')
  }

  const handleLevelTwoChestDigit = (digit) => {
    if (!levelTwoInventory.paper) {
      setMessage('Primero necesitas obtener el papel con la pista antes de usar el teclado del cofre.')
      return
    }

    if (digit === 'C') {
      setLevelTwoCode('')
      setLevelTwoFeedback('')
      setMessage('Tablero del cofre reiniciado.')
      return
    }

    if (digit === 'E') {
      if (levelTwoCode === '1212') {
        playDoorOpenSound()
        setLevelTwoChestUnlocked(true)
        setLevelTwoFeedback('')
        openLevelTwoOverlay('level2-chest-open')
        return
      }

      if (levelTwoCode.length === 4) {
        setLevelTwoFeedback('Inválido')
        playErrorSound()
        setMessage('Ese código no abre el cofre.')
      } else {
        setMessage('El cofre necesita cuatro dígitos antes de validar.')
      }
      return
    }

    const nextCode = `${levelTwoCode}${digit}`.slice(0, 4)
    setLevelTwoCode(nextCode)

    if (nextCode.length < 4) {
      setLevelTwoFeedback('')
      setMessage(`Código parcial del cofre: ${nextCode}`)
      return
    }

    if (nextCode === '1212') {
      setLevelTwoFeedback('')
      setMessage('Código correcto cargado. Presiona E para abrir.')
      return
    }

    setLevelTwoFeedback('Inválido')
    playErrorSound()
    setMessage('Ese código no coincide con el cofre.')
  }

  const openLevelThreePreview = () => {
    setLevelThreePreview(true)
    setCurrentLevel(3)
    openLevelTwoOverlay('level3-preview')
  }

  return (
    <div className="scape-room app-wrapper">
      <div className="scape-room__container">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="app-header">
          <span className="app-modulo">Módulo 05 - React.js</span>
          <h1>Scape-Room</h1>
          <p>
            {currentLevel === 1 && 'Nivel 1 del escape room. Explora, recoge objetos y úsalo todo en el orden correcto hasta abrir la puerta.'}
            {currentLevel === 2 && 'Nivel 2 desbloqueado. La nueva escena ya está visible para seguir construyendo el juego.'}
            {currentLevel === 3 && 'Nivel 3 visible. Próximamente construiremos el reto final de la aventura.'}
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
              ) : currentLevel === 2 ? (
                <>
                  <img
                    src={levelTwoImage}
                    alt="Habitación del nivel 2"
                    className="scape-room__room-image"
                  />
                  <div className="scape-room__level-badge">Nivel 2</div>
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--level2-plant"
                    onClick={() => handleLevelTwoHotspot('plant')}
                    aria-label="Revisar la maceta"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--level2-table"
                    onClick={() => handleLevelTwoHotspot('table')}
                    aria-label="Revisar la mesa redonda"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--level2-chest"
                    onClick={() => handleLevelTwoHotspot('chest')}
                    aria-label="Abrir el cofre"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--level2-lock"
                    onClick={() => handleLevelTwoHotspot('lock')}
                    aria-label="Revisar el candado"
                  />
                  <button
                    type="button"
                    className="scape-room__hotspot scape-room__hotspot--level2-shelf"
                    onClick={() => handleLevelTwoHotspot('shelf')}
                    aria-label="Revisar el estante"
                  />
                </>
              ) : (
                <>
                  <img
                    src={levelThreeImage}
                    alt="Habitación del nivel 3"
                    className="scape-room__room-image"
                  />
                  <div className="scape-room__level-badge">Nivel 3</div>
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
                  {overlay === 'level2-plant' && (
                    <div className="scape-room__overlay-card">
                      <img src={levelTwoPlantImage} alt="Maceta del nivel 2" className="scape-room__overlay-image" />
                      {!levelTwoInventory.opener && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--level2-opener"
                          onClick={() => collectLevelTwoItem('opener')}
                          aria-label="Tomar el destapador"
                        />
                      )}
                    </div>
                  )}
                  {overlay === 'level2-table-closed' && (
                    <div className="scape-room__overlay-card">
                      <img src={levelTwoTableClosedImage} alt="Mesa del nivel 2 con botella cerrada" className="scape-room__overlay-image" />
                      <div className="scape-room__drop-zone scape-room__drop-zone--bottle" onDragOver={(event) => event.preventDefault()} onDrop={handleDropUnlockBottle} />
                    </div>
                  )}
                  {overlay === 'level2-table-open' && (
                    <div className="scape-room__overlay-card">
                      <img src={levelTwoTableOpenImage} alt="Mesa del nivel 2 con el acertijo revelado" className="scape-room__overlay-image" />
                      {!levelTwoInventory.paper && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--level2-paper"
                          onClick={() => collectLevelTwoItem('paper')}
                          aria-label="Tomar el papel"
                        />
                      )}
                    </div>
                  )}
                  {overlay === 'level2-chest' && (
                    <div className="scape-room__overlay-card scape-room__overlay-card--chest">
                      <img src={levelTwoChestImage} alt="Cofre del nivel 2" className="scape-room__overlay-image" />
                      <div className="scape-room__safe-ui">
                        {chestButtons.map((button) => (
                          <button
                            key={button.digit}
                            type="button"
                            className={`scape-room__digit scape-room__digit--chest ${button.digit.length === 1 && /\d/.test(button.digit) ? '' : 'scape-room__digit--small'}`}
                            style={{ top: button.top, left: button.left }}
                            onClick={() => handleLevelTwoChestDigit(button.digit)}
                          >
                            {button.digit}
                          </button>
                        ))}
                        <div className="scape-room__safe-display scape-room__safe-display--chest">{levelTwoCode || '----'}</div>
                        {levelTwoFeedback && <div className="scape-room__safe-feedback scape-room__safe-feedback--chest">{levelTwoFeedback}</div>}
                        {!levelTwoInventory.paper && (
                          <div className="scape-room__safe-feedback scape-room__safe-feedback--chest scape-room__safe-feedback--locked">
                            Encuentra primero el papel
                          </div>
                        )}
                        <button
                          type="button"
                          className="scape-room__reset scape-room__reset--chest"
                          onClick={() => handleLevelTwoChestDigit('C')}
                        >
                          Reiniciar
                        </button>
                      </div>
                    </div>
                  )}
                  {overlay === 'level2-chest-open' && (
                    <div className="scape-room__overlay-card scape-room__overlay-card--chest">
                      <img src={levelTwoChestOpenImage} alt="Cofre abierto con la tenaza" className="scape-room__overlay-image" />
                      {!levelTwoInventory.pliers && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--level2-pliers"
                          onClick={() => collectLevelTwoItem('pliers')}
                          aria-label="Tomar la tenaza"
                        />
                      )}
                    </div>
                  )}
                  {overlay === 'level2-lock' && (
                    <div className="scape-room__overlay-card">
                      <img src={levelTwoLockUnlocked ? levelTwoUnlockedLockImage : levelTwoLockImage} alt="Puerta secreta del nivel 2" className="scape-room__overlay-image" />
                      {!levelTwoLockUnlocked && (
                        <div className="scape-room__drop-zone scape-room__drop-zone--lock" onDragOver={(event) => event.preventDefault()} onDrop={handleDropUnlockLock} />
                      )}
                      {levelTwoLockUnlocked && !levelTwoInventory.book && (
                        <button
                          type="button"
                          className="scape-room__collect scape-room__collect--level2-book"
                          onClick={() => collectLevelTwoItem('book')}
                          aria-label="Tomar el libro"
                        />
                      )}
                    </div>
                  )}
                  {overlay === 'level2-shelf' && (
                    <div className="scape-room__overlay-card">
                      <img src={levelTwoShelfImage} alt="Estante del nivel 2" className="scape-room__overlay-image" />
                      <div className="scape-room__drop-zone scape-room__drop-zone--shelf" onDragOver={(event) => event.preventDefault()} onDrop={handleDropShelfBook} />
                    </div>
                  )}
                  {overlay === 'level2-final' && (
                    <div className="scape-room__overlay-card">
                      <img src={levelTwoFinalImage} alt="Final del nivel 2" className="scape-room__overlay-image" />
                      <button type="button" className="scape-room__hotspot scape-room__hotspot--level2-final-exit" onClick={openLevelThreePreview} aria-label="Pasar al nivel 3" />
                      <div className="scape-room__victory">
                        <h2>Nivel 2 completado</h2>
                        <p>El estante se abrió. Haz clic en el nuevo pasillo para entrar al nivel 3.</p>
                      </div>
                    </div>
                  )}
                  {overlay === 'level3-preview' && (
                    <div className="scape-room__overlay-card scape-room__overlay-card--full">
                      <img src={levelThreeImage} alt="Vista previa del nivel 3" className="scape-room__overlay-image" />
                      <div className="scape-room__victory">
                        <h2>Próximamente</h2>
                        <p>El nivel 3 ya está visible como siguiente escenario. En el próximo paso construiremos su lógica.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="scape-room__sidebar">
            <div className="scape-room__panel scape-room__panel--actions">
              <button
                type="button"
                className="scape-room__restart-button"
                onClick={resetGame}
              >
                Reiniciar el juego
              </button>
              {currentLevel >= 2 && (
                <button
                  type="button"
                  className="scape-room__restart-button scape-room__restart-button--secondary"
                  onClick={resetLevelTwo}
                >
                  Reiniciar nivel 2
                </button>
              )}
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
                <div className="scape-room__inventory">
                  {Object.entries(levelTwoInventoryConfig).map(([item, config]) => (
                    <div
                      key={item}
                      className={`scape-room__inventory-item ${levelTwoInventory[item] ? 'is-active is-draggable' : 'is-empty'} ${levelTwoDraggedItem === item ? 'is-selected' : ''}`}
                      draggable={levelTwoInventory[item]}
                      onDragStart={() => handleLevelTwoDragStart(item)}
                      onDragEnd={() => setLevelTwoDraggedItem(null)}
                    >
                      {levelTwoInventory[item] ? (
                        <>
                          <img src={config.image} alt={config.label} />
                          <span>{config.label}</span>
                        </>
                      ) : (
                        <span>Vacío</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="scape-room__panel">
              <h2>Estado del juego</h2>
              <p>{message}</p>
              {currentLevel === 1 ? (
                <div className="scape-room__progress">
                  <span className={inventory.handle ? 'is-done' : ''}>Manija</span>
                  <span className={inventory.key ? 'is-done' : ''}>Llave</span>
                  <span className={inventory.knob ? 'is-done' : ''}>Perilla</span>
                  <span className={completed ? 'is-done' : ''}>Puerta abierta</span>
                </div>
              ) : (
                <div className="scape-room__progress">
                  <span className={levelTwoInventory.opener ? 'is-done' : ''}>Destapador</span>
                  <span className={levelTwoInventory.paper ? 'is-done' : ''}>Papel</span>
                  <span className={levelTwoInventory.pliers ? 'is-done' : ''}>Tenaza</span>
                  <span className={levelTwoInventory.book ? 'is-done' : ''}>Libro</span>
                  <span className={levelTwoShelfSolved ? 'is-done' : ''}>Paso secreto</span>
                  <span className={levelThreePreview ? 'is-done' : ''}>Nivel 3 visto</span>
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default ScapeRoom







