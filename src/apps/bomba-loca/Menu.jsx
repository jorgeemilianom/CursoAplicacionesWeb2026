import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "./GameContext";
import "./Menu.css";

function Menu() {
  const { setPantalla, setDificultad, dificultad, altoContraste, setAltoContraste } =
    useContext(GameContext);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const navigate = useNavigate();

  const seleccionar = (nivel) => {
    setDificultad(nivel);
  };

  const jugar = () => {
    setPantalla("game");
  };

  const volverAApps = () => {
    navigate("/apps");
  };

  return (
    <div className={`menu-shell ${altoContraste ? "alto-contraste" : ""}`}>
      <div className="menu-overlay" />
      <div className="menu">
        <button className="volver-apps" onClick={volverAApps}>
          ← Volver a Apps
        </button>
        <h1 className="menu-title">💣 Bomba Loca</h1>
        <p className="menu-subtitle">Elegí la dificultad para empezar la ronda</p>
        <div className="acciones-menu">
          <button className="ayuda" onClick={() => setMostrarAyuda(true)}>
            ¿Cómo se juega?
          </button>
          <button
            className={`contraste-btn ${altoContraste ? "activo" : ""}`}
            onClick={() => setAltoContraste((prev) => !prev)}
            aria-pressed={altoContraste}
          >
            {altoContraste ? "Alto contraste: ON" : "Alto contraste: OFF"}
          </button>
        </div>

        <div className="botones">
          <button
            className={dificultad === "facil" ? "activo" : ""}
            onClick={() => seleccionar("facil")}
          >
            Fácil
          </button>

          <button
            className={dificultad === "medio" ? "activo" : ""}
            onClick={() => seleccionar("medio")}
          >
            Medio
          </button>

          <button
            className={dificultad === "dificil" ? "activo" : ""}
            onClick={() => seleccionar("dificil")}
          >
            Difícil
          </button>
        </div>

        <button className="jugar" onClick={jugar}>
          ▶️ Jugar
        </button>
      </div>

      {mostrarAyuda && (
        <div
          className="modal-backdrop"
          onClick={() => setMostrarAyuda(false)}
          role="presentation"
        >
          <section
            className="modal-ayuda"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ayuda-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="ayuda-titulo">Cómo funciona el juego</h2>
            <p>
              El objetivo es no quedarte con la bomba cuando explota. La bomba va
              pasando entre jugadores y el tiempo es limitado.
            </p>
            <p>
              <strong>Dificultad:</strong> cambia la velocidad y reacción de la IA.
            </p>
            <p>
              <strong>▶️ Jugar:</strong> inicia la partida con la dificultad elegida.
            </p>
            <p>
              <strong>Pasar a la izquierda / derecha:</strong> en tu turno decidís a
              quién enviar la bomba.
            </p>
            <p>
              <strong>Reiniciar:</strong> arranca una nueva ronda al finalizar.
            </p>
            <p>
              <strong>Volver al menú:</strong> regresa a esta pantalla para cambiar
              dificultad.
            </p>

            <button className="cerrar-ayuda" onClick={() => setMostrarAyuda(false)}>
              Cerrar
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default Menu;
