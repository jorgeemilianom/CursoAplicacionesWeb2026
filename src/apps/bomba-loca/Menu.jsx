import { useContext, useState } from "react";
import { GameContext } from "./GameContext";
import "./Menu.css";

function Menu() {
  const { setPantalla, setDificultad, dificultad, altoContraste, setAltoContraste } =
    useContext(GameContext);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const seleccionar = (nivel) => {
    setDificultad(nivel);
  };

  const jugar = () => {
    // 👇 ESTE ES EL CAMBIO CLAVE: Ahora vamos al selector de Messi
    setPantalla("selector");
  };

  return (
    <div className={`menu-shell ${altoContraste ? "alto-contraste" : ""}`}>
      <div className="menu-overlay" />
      <div className="menu">
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
              pasando entre jugadores en círculo y el tiempo es limitado.
            </p>
            <p>
              <strong>Dificultad:</strong> cambia la velocidad, la inteligencia y la "maldad" de los robots (Terminator y Freddy).
            </p>
            <p>
              <strong>Inicio de partida:</strong> Cuando el contador llega a cero, tenés que tocar a CUALQUIER jugador para que empiece con la bomba.
            </p>
            <p>
              <strong>Pasar la bomba:</strong> Cuando te toca a vos, ¡rápido! Hacé clic en el jugador que tenés a tu izquierda o a tu derecha para pasársela.
            </p>
            <p>
              <strong>Alto Contraste:</strong> Activalo para jugar en blanco y negro puro, ideal para mejorar la visibilidad.
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