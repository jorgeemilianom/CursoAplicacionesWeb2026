import { Link } from 'react-router-dom'
import PanelControl from './PanelControl'
import LienzoGame from './LienzoGame'
import Ganaste from './Ganaste'
import { ConfigProvider } from './context/ConfigContext.jsx'
import { PuzzleProvider, usePuzzle } from './context/PuzzleContext.jsx'
import '../ArchivosCSS/Rompecabezas.css'
import '../ArchivosCSS/PuzzlePanel.css'
import '../ArchivosCSS/PuzzleBoard.css'

const CONCEPTS = [
  ['useState', 'Controlar tablero, piezas libres, tiempo y movimientos'],
  ['useEffect', 'Reiniciar la partida al cambiar la dificultad y detectar la victoria'],
  ['useContext', 'Compartir configuracion y estado del juego sin prop drilling'],
  ['drag and drop', 'Mover piezas entre bandeja y tablero usando eventos nativos del navegador'],
]

function PuzzleRaiz() {
  return <ConfigProvider><PuzzleProvider><PuzzleScreen /></PuzzleProvider></ConfigProvider>
}

function PuzzleScreen() {
  const { isWon } = usePuzzle()

  return (
    <div className="puzzle-page app-wrapper">
      <div className="puzzle-page__container">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>
        <header className="app-header">
          <span className="app-modulo">Modulo 05 - React.js</span>
          <h1>Rompecabezas Mario Galaxy</h1>
          <p>Dos sectores, piezas desordenadas y un lienzo vacio para arrastrar cada ficha hasta completar la imagen de Mario Galaxy.</p>
        </header>

        <PanelControl />

        <LienzoGame />

        <div className="app-conceptos">
          <h2>Que conceptos practicamos aca?</h2>
          <ul>
            {CONCEPTS.map(([label, text]) => <li key={label}><code>{label}</code><span>{text}</span></li>)}
            <li><span className="tag-neutro">Logica de juego</span><span>Validar posiciones correctas y medir el progreso del armado</span></li>
          </ul>
        </div>

        {isWon && <Ganaste />}
      </div>
    </div>
  )
}

export default PuzzleRaiz
