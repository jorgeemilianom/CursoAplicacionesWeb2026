import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import WordForm from '../../components/WordForm'
import WordList from '../../components/WordList'
import Grid from '../../components/Grid'
import Timer from '../../components/TImer.jsx'
import { generateGrid } from '../../utils/wordSearch'
import './SopaDeLetras.css'

function SopaDeLetras() {
  const [words, setWords] = useState([])
  const [grid, setGrid] = useState([])
  const [initialTime, setInitialTime] = useState(60)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameActive, setGameActive] = useState(false)
  const [foundWordsCount, setFoundWordsCount] = useState(0)
  const [gameStatus, setGameStatus] = useState(null)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState('es')
  const [showCeleb, setShowCeleb] = useState(false)
  const [lastWord, setLastWord] = useState('')

  const translations = {
    es: {
      title: 'Sopa de Letras Profesional',
      langBtn: 'English',
      themeBtnDark: 'Modo oscuro',
      themeBtnLight: 'Modo claro',
      statsWords: 'Total',
      statsFound: 'Encontradas',
      labelTime: 'Tiempo (seg)',
      playBtn: 'Empezar partida',
      resetBtn: 'Reiniciar',
      winTitle: 'Ganaste',
      lostTitle: 'Tiempo agotado',
      modalStats: 'Encontraste {{count}} de {{total}} palabras.',
      modalRetry: 'Jugar de nuevo',
      celebText: 'Excelente',
      intro: 'Creá tu lista, generá el tablero y encontrá todas las palabras antes de que termine el tiempo.',
      boardTitle: 'Tablero de juego',
      boardText: 'Seleccioná letras en línea recta para marcar una palabra completa.',
      listTitle: 'Palabras cargadas',
      listText: 'Podés agregar, quitar y volver a generar la sopa cuando quieras.',
      timerText: 'El tiempo corre cuando empieza la partida.',
    },
    en: {
      title: 'Word Search Pro',
      langBtn: 'Español',
      themeBtnDark: 'Dark mode',
      themeBtnLight: 'Light mode',
      statsWords: 'Total',
      statsFound: 'Found',
      labelTime: 'Time (sec)',
      playBtn: 'Start game',
      resetBtn: 'Reset',
      winTitle: 'You won',
      lostTitle: "Time's up",
      modalStats: 'You found {{count}} out of {{total}} words.',
      modalRetry: 'Play again',
      celebText: 'Great job',
      intro: 'Build your own word list, generate the board and find every word before the timer ends.',
      boardTitle: 'Game board',
      boardText: 'Select letters in a straight line to mark a complete word.',
      listTitle: 'Loaded words',
      listText: 'You can add, remove and regenerate the puzzle whenever you want.',
      timerText: 'The timer starts running when the match begins.',
    },
  }

  const t = translations[language]

  useEffect(() => {
    document.body.style.background = darkMode ? '#020617' : '#ffffff'

    return () => {
      document.body.style.background = '#ffffff'
    }
  }, [darkMode])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'))
    resetGame()
  }

  const addWord = (word) => {
    const clean = word.trim().toUpperCase()
    if (!clean || words.includes(clean)) return
    setWords((prev) => [...prev, clean])
    resetGame()
  }

  const deleteWord = (index) => {
    setWords((prev) => prev.filter((_, i) => i !== index))
    resetGame()
  }

  const resetGame = () => {
    setGrid([])
    setGameActive(false)
    setGameStatus(null)
    setFoundWordsCount(0)
    setShowCeleb(false)
    setTimeLeft(initialTime)
  }

  const createGrid = () => {
    if (words.length === 0) {
      alert(language === 'es' ? 'Agregá al menos una palabra.' : 'Add at least one word.')
      return
    }

    setGrid(generateGrid(words))
    setTimeLeft(initialTime)
    setFoundWordsCount(0)
    setGameActive(true)
    setGameStatus(null)
  }

  const handleWordFound = (word) => {
    setLastWord(word)
    setShowCeleb(true)
    window.setTimeout(() => setShowCeleb(false), 1500)

    setFoundWordsCount((prev) => {
      const next = prev + 1

      if (next === words.length) {
        setGameActive(false)
        window.setTimeout(() => setGameStatus('won'), 400)
      }

      return next
    })
  }

  const handleTimeUp = () => {
    setGameActive(false)
    setGameStatus('lost')
  }

  const progress = words.length > 0 ? (foundWordsCount / words.length) * 100 : 0

  return (
    <div className={`sopa ${darkMode ? 'sopa--dark' : 'sopa--light'}`}>
      <div className="sopa__container">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>

        <header className="sopa__header">
          <div className="app-header">
            <span className="app-modulo">Módulo 05 — React.js</span>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
          </div>

          <div className="sopa__actions">
            <button onClick={toggleLanguage} className="sopa__btn sopa__btn--secondary">
              {t.langBtn}
            </button>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="sopa__btn sopa__btn--secondary"
            >
              {darkMode ? t.themeBtnLight : t.themeBtnDark}
            </button>
          </div>
        </header>

        <div className="sopa__progress">
          <div className="sopa__progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="sopa__stats">
          <div className="sopa__stat">
            <span>{t.statsWords}</span>
            <strong>{words.length}</strong>
          </div>
          <div className={`sopa__timer ${timeLeft <= 10 && gameActive ? 'sopa__timer--critical' : ''}`}>
            ⏱ {timeLeft}s
          </div>
          <div className="sopa__stat">
            <span>{t.statsFound}</span>
            <strong>{foundWordsCount}</strong>
          </div>
        </div>

        {!gameActive && (
          <div className="sopa__time-selector">
            <label htmlFor="sopa-time">{t.labelTime}</label>
            <input
              id="sopa-time"
              type="number"
              min="10"
              value={initialTime}
              onChange={(e) => setInitialTime(Number(e.target.value) || 10)}
            />
            <span className="sopa__time-help">{t.timerText}</span>
          </div>
        )}

        <Timer
          seconds={timeLeft}
          setSeconds={setTimeLeft}
          isActive={gameActive}
          onTimeUp={handleTimeUp}
        />

        <div className="sopa__form">
          <WordForm addWord={addWord} language={language} />
        </div>

        <div className="sopa__layout">
          <section className="sopa__board">
            <div className="sopa__section-header">
              <h2>{t.boardTitle}</h2>
              <p>{t.boardText}</p>
            </div>
            {grid.length > 0 ? (
              <Grid
                grid={grid}
                words={words}
                onWordFound={handleWordFound}
                gameActive={gameActive}
                language={language}
              />
            ) : (
              <div className="sopa__placeholder">
                <h2>{language === 'es' ? 'Tu tablero aparecerá acá' : 'Your board will appear here'}</h2>
                <p>
                  {language === 'es'
                    ? 'Agregá palabras y presioná empezar para generar la sopa.'
                    : 'Add words and press start to generate the puzzle.'}
                </p>
              </div>
            )}
          </section>

          <aside className="sopa__words">
            <div className="sopa__section-header">
              <h2>{t.listTitle}</h2>
              <p>{t.listText}</p>
            </div>
            <WordList words={words} deleteWord={deleteWord} language={language} />
          </aside>
        </div>

        <button onClick={gameActive ? resetGame : createGrid} className="sopa__btn sopa__btn--primary">
          {gameActive ? t.resetBtn : t.playBtn}
        </button>

        {showCeleb && (
          <div className="sopa__overlay">
            <div className="sopa__celebration">
              <img
                src="/assets/lastWord.webp"
                alt={t.celebText}
                className="sopa__celebration-image"
              />
              <h3>{t.celebText}</h3>
              <p>{lastWord}</p>
            </div>
          </div>
        )}

        {gameStatus && (
          <div className="sopa__overlay">
            <div className="sopa__result">
              <h2>{gameStatus === 'won' ? t.winTitle : t.lostTitle}</h2>
              <p>{t.modalStats.replace('{{count}}', foundWordsCount).replace('{{total}}', words.length)}</p>
              <button onClick={resetGame} className="sopa__btn sopa__btn--primary">
                {t.modalRetry}
              </button>
            </div>
          </div>
        )}

        <div className="app-conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <code>useState</code>
              <span>Controlar palabras, temporizador, progreso y estado de la partida</span>
            </li>
            <li>
              <code>useEffect</code>
              <span>Sincronizar el modo visual del juego con el documento</span>
            </li>
            <li>
              <code>Array.map()</code>
              <span>Renderizar el tablero y la lista de palabras dinámicamente</span>
            </li>
            <li>
              <code>setTimeout</code>
              <span>Mostrar animaciones de celebración y cierre de partida</span>
            </li>
            <li>
              <span className="tag-neutro">Lógica de juego</span>
              <span>Generar una grilla y validar selecciones en línea recta</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SopaDeLetras
