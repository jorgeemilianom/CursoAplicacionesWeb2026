import { useContext } from 'react'
import { GameContext, GameProvider } from './GameContext'
import Game from './Game'
import Menu from './Menu'

function BombaLocoContent() {
  const { pantalla } = useContext(GameContext)

  return (
    <>
      {pantalla === 'menu' && <Menu />}
      {pantalla === 'game' && <Game />}
    </>
  )
}

function BombaLoca() {
  return (
    <GameProvider>
      <BombaLocoContent />
    </GameProvider>
  )
}

export default BombaLoca
