import { useContext } from "react";
import { GameContext } from "./GameContext";
import "./Selector.css";

const opcionesPersonajes = [
  { id: 1, nombre: "Messi Normal", foto: "/messi_normal.png", frase: "¡Andá p'allá, bobo!" },
  { id: 2, nombre: "Messi Morocho", foto: "/messi_morocho.png", frase: "¡Dale que somos campeones!" },
  { id: 3, nombre: "Messi Rico", foto: "/messi_rico.png", frase: "Facha y gloria." }
];

function Selector() {
  const { setPersonaje, setPantalla } = useContext(GameContext);

  const elegirYJugar = (p) => {
    setPersonaje(p); 
    setPantalla("game"); 
  };

  return (
    <div className="selector-container">
      <header className="selector-header">
        <h1 className="selector-title">Elegí tu Messi</h1>
        <p className="selector-subtitle">¿Cuál de los tres ganará hoy?</p>
      </header>
      
      <div className="opciones-grid">
        {opcionesPersonajes.map((p) => (
          <button key={p.id} className="avatar-card" onClick={() => elegirYJugar(p)}>
            <div className="avatar-frame">
              <img src={p.foto} alt={p.nombre} className="avatar-img" />
            </div>
            <div className="avatar-info">
              <span className="avatar-name">{p.nombre}</span>
              <p className="avatar-frase">"{p.frase}"</p>
            </div>
          </button>
        ))}
      </div>
      <button className="btn-sub" onClick={() => setPantalla("menu")}>Volver</button>
    </div>
  );
}

export default Selector;