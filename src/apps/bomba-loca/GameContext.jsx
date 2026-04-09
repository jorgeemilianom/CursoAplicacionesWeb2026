import { createContext, useState } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [pantalla, setPantalla] = useState("menu");
  const [dificultad, setDificultad] = useState("medio");

  return (
    <GameContext.Provider
      value={{
        pantalla,
        setPantalla,
        dificultad,
        setDificultad,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
