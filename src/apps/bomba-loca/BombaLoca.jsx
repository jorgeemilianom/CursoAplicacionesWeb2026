import { useContext } from 'react'
import { GameContext, GameProvider } from './GameContext'
import Game from './Game'
import Menu from './Menu'
import Selector from './Selector' // <--- 1. IMPORTAMOS EL SELECTOR

function BombaLocoContent() {
  const { pantalla } = useContext(GameContext)

  return (
    <>
      {pantalla === 'menu' && <Menu />}
      {pantalla === 'selector' && <Selector />} {/* <--- 2. AGREGAMOS ESTA LÍNEA */}
      {pantalla === 'game' && <Game />}
    </>
  )
}

function BombaLoca() {
  return (
    <div style={{ paddingTop: '80px' }}> {/* <--- Este empujoncito */}
      <GameProvider>
        <BombaLocoContent />
      </GameProvider>
    </div>
  )
}

export default BombaLoca