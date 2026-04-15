import { Link } from 'react-router-dom'
import { GameProvider, useGame } from './ArchivosJSX/context/GameContext'
import { DeckProvider } from './ArchivosJSX/context/DeckContext'
import { BattleProvider } from './ArchivosJSX/context/BattleContext'
import MenuScreen from './ArchivosJSX/screens/MenuScreen'
import GameScreen from './ArchivosJSX/screens/GameScreen'
import ResultScreen from './ArchivosJSX/screens/ResultScreen'
import './CardBattleJG.css'

/**
 * GameRouter - Maneja qué pantalla mostrar según el estado del juego
 */
function GameRouter() {
  const { gameStatus } = useGame()

  switch (gameStatus) {
    case 'menu':
      return <MenuScreen />
    case 'playing':
      return <GameScreen />
    case 'gameover':
      return <ResultScreen />
    default:
      return <MenuScreen />
  }
}

/**
 * CardBattleJG - Componente principal del juego Card Battle
 * Estructura de Providers: GameProvider -> DeckProvider -> BattleProvider
 */
function CardBattleJG() {
  return (
    <div className="app-wrapper card-battle">
      <div className="card-battle__nav">
        <Link to="/apps" className="app-volver">← Volver a aplicaciones</Link>
      </div>

      <GameProvider>
        <DeckProvider>
          <BattleProvider>
            <GameRouter />
          </BattleProvider>
        </DeckProvider>
      </GameProvider>
    </div>
  )
}

export default CardBattleJG