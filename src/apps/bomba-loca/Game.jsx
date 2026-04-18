import { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "./GameContext";
import "./Game.css";

const DIRECCION_DERECHA = 1;
const DIRECCION_IZQUIERDA = -1;

function Game() {
  const { dificultad, setPantalla, altoContraste, personaje } = useContext(GameContext);

  // Armamos la mesa
  const [jugadores] = useState([
    { nombre: personaje.nombre, foto: personaje.foto, isHuman: true },
    { nombre: "Freddy", foto: "/freddys_fridays.png" },
    { nombre: "Terminator", foto: "/terminator.png" },
    { nombre: "Robot", foto: "/robot_comun.png" },
    { nombre: "Freddy 2", foto: "/freddys_fridays.png" },
    { nombre: "Terminator 2", foto: "/terminator.png" },
    { nombre: "Robot 2", foto: "/robot_comun.png" },
    { nombre: "Robot 3", foto: "/robot_comun.png" },
  ]);

  const [bombaIndex, setBombaIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [inicio, setInicio] = useState(null); 
  const [avisoCambio, setAvisoCambio] = useState("");
  const [cuentaRegresiva, setCuentaRegresiva] = useState(5);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [pasesRealizados, setPasesRealizados] = useState(0);

  const tickAudioRef = useRef(null);
  const explosionAudioRef = useRef(null);

  // Iniciar audio
  useEffect(() => {
    tickAudioRef.current = new Audio("/tick.mp3");
    explosionAudioRef.current = new Audio("/explosion.mp3");
  }, []);

  // Lógica de inicio y explosión
  useEffect(() => {
    if (cuentaRegresiva > 0) {
      const t = setTimeout(() => setCuentaRegresiva(cuentaRegresiva - 1), 1000);
      return () => clearTimeout(t);
    } else if (!juegoIniciado && !gameOver) {
      setTiempo(8000 + Math.random() * 5000);
      setInicio(Date.now());
      setJuegoIniciado(true);
    }
  }, [cuentaRegresiva, juegoIniciado, gameOver]);

  useEffect(() => {
    if (!juegoIniciado || gameOver || !inicio) return;
    const t = setTimeout(() => {
      explosionAudioRef.current?.play().catch(() => {});
      setGameOver(true);
    }, tiempo - (Date.now() - inicio));
    return () => clearTimeout(t);
  }, [juegoIniciado, gameOver, inicio, tiempo]);

  // IA con MODO COMPLOT
  useEffect(() => {
    if (gameOver || !juegoIniciado || bombaIndex === 0) return;

    const total = jugadores.length;
    const tiempoRestante = tiempo - (Date.now() - inicio);
    const esFinal = tiempoRestante < 3000;
    const delay = esFinal ? 400 : 1000;

    const iaTimer = setTimeout(() => {
      setAvisoCambio(""); // limpiar mensaje anterior antes de actuar
      if (esFinal && Math.random() < 0.6) {
        setAvisoCambio("🎯 ¡COMPLOT! Te apuntaron directo");
        setBombaIndex(0);
        return;
      }
      const vDer = (bombaIndex + 1) % total;
      const vIzq = (bombaIndex - 1 + total) % total;
      const dirIA = (0 - bombaIndex + total) % total < (bombaIndex - 0 + total) % total
        ? DIRECCION_DERECHA
        : DIRECCION_IZQUIERDA;

      setAvisoCambio("🤖 Pasando...");
      setBombaIndex(dirIA === DIRECCION_DERECHA ? vDer : vIzq);
    }, delay);

    return () => clearTimeout(iaTimer);
  }, [bombaIndex, juegoIniciado, gameOver]);

  const pasarBomba = (dir) => {
    if (gameOver || !juegoIniciado || bombaIndex !== 0) return;
    setAvisoCambio("");
    setPasesRealizados(p => p + 1);
    setBombaIndex(prev => (prev + dir + jugadores.length) % jugadores.length);
  };

  // 👇 NUEVA FUNCIÓN: Reinicia todo a cero para volver a jugar
  const reiniciarJuego = () => {
    setBombaIndex(0);
    setGameOver(false);
    setTiempo(0);
    setInicio(null);
    setAvisoCambio("");
    setCuentaRegresiva(5);
    setJuegoIniciado(false);
    setPasesRealizados(0);
  };

  return (
    <div className={`game-shell ${altoContraste ? "alto-contraste" : ""}`}>
      <div className="container" style={{ position: "relative" }}>
        
        {/* 👇 NUEVA FLECHA DE VOLVER */}
        <button className="btn-volver" onClick={() => setPantalla("menu")}>
          ⬅️ Volver
        </button>

        <header className="game-hud">
          {cuentaRegresiva > 0 ? (
            <div className="contador-box">
              <div className="cartel-tutorial inicio">👆 ¡Elegí quién empieza!</div>
              <h1 className="countdown">{cuentaRegresiva}</h1>
            </div>
          ) : (
            <div className="info-turno">
              <p className="game-turno">{bombaIndex === 0 ? "¡PASALA!" : `Turno: ${jugadores[bombaIndex].nombre}`}</p>
              {bombaIndex === 0 && !gameOver && pasesRealizados < 3 && (
                <div className="cartel-tutorial warning">⚠️ ¡SOLO a los de al lado!</div>
              )}
            </div>
          )}
        </header>

        <div className="circle-container">
          {jugadores.map((j, i) => {
            const total = jugadores.length;
            const angulo = (i / total) * (2 * Math.PI) - Math.PI / 2;
            const x = Math.cos(angulo) * 140;
            const y = Math.sin(angulo) * 140;
            const esVecino = (bombaIndex === 0 && (i === 1 || i === total - 1));

            return (
              <div
                key={i}
                onClick={() => {
                   if(!juegoIniciado) setBombaIndex(i);
                   if(esVecino) pasarBomba(i === 1 ? DIRECCION_DERECHA : DIRECCION_IZQUIERDA);
                }}
                className={`player-circular ${i === bombaIndex ? "activo" : ""} ${esVecino || !juegoIniciado ? "vecino-clicable" : ""}`}
                style={{ "--x": `${x}px`, "--y": `${y}px` }}
              >
                <div className="photo-frame">
                  <img src={j.foto} className="player-photo" alt={j.nombre} />
                </div>
                {i === bombaIndex && <span className="bomb-emoji">💣</span>}
              </div>
            );
          })}
        </div>

        <footer className="game-footer">
          {gameOver ? (
            <div className="acciones">
              <h2 className="explosion-text">💥 ¡BOOM!</h2>
              {/* 👇 NUEVOS BOTONES DE FINAL */}
              <div className="botones-final">
                <button className="btn-main reiniciar" onClick={reiniciarJuego}>🔄 Otra vez</button>
                <button className="btn-main menu" onClick={() => setPantalla("menu")}>🏠 Menú</button>
              </div>
            </div>
          ) : <p className="aviso-ia">{avisoCambio}</p>}
        </footer>
      </div>
    </div>
  );
}

export default Game;