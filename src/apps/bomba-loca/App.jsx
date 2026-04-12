import { useContext } from "react";
import { GameContext } from "./GameContext"; 
import Menu from "./Menu";
import Selector from "./Selector"; 
import Game from "./Game";

function App() {
  const { pantalla } = useContext(GameContext);

  return (
    <div className="app-container">
      {pantalla === "menu" && <Menu />}
      {pantalla === "selector" && <Selector />} 
      {pantalla === "game" && <Game />}
    </div>
  );
}

export default App;