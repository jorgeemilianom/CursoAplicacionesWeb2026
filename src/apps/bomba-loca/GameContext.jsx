import { createContext, useState } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  // Los estados que ya tenías
  const [pantalla, setPantalla] = useState("menu");
  const [dificultad, setDificultad] = useState("medio");
  const [altoContraste, setAltoContraste] = useState(false);
  
  // 👉 EL ESTADO NUEVO: Para guardar al Messi que elijas en el Selector
  const [personaje, setPersonaje] = useState({ 
    nombre: "Messi Normal", 
    foto: "/messi_normal.png" 
  });

  return (
    <GameContext.Provider
      value={{
        pantalla, setPantalla,
        dificultad, setDificultad,
        altoContraste, setAltoContraste,
        personaje, setPersonaje // 👉 ACÁ LO EXPORTAMOS
      }}
    >
      {children}
    </GameContext.Provider>
  );
}