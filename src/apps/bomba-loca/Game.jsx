import { useContext, useState, useEffect, useRef } from "react";
import { GameContext } from "./GameContext";
import "./Game.css";

const jugadoresIniciales = ["🧑", "🤖", "🤖", "🤖", "🤖", "🤖", "🤖", "🤖"];
const DIRECCION_DERECHA = 1;
const DIRECCION_IZQUIERDA = -1;

function Game() {
  const { dificultad, setPantalla } = useContext(GameContext);

  const [jugadores] = useState(jugadoresIniciales);
  const [bombaIndex, setBombaIndex] = useState(0);
  const [direccion, setDireccion] = useState(DIRECCION_DERECHA);
  const [gameOver, setGameOver] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [inicio, setInicio] = useState(Date.now());
  const [avisoCambio, setAvisoCambio] = useState("");
  const [tickDuracionMs, setTickDuracionMs] = useState(650);
  const historialJugadorRef = useRef({
    izquierda: 0,
    derecha: 0,
    racha: 0,
    ultima: null,
  });
  const tickAudioRef = useRef(null);
  const explosionAudioRef = useRef(null);
  const direccionOpuesta = (dir) =>
    dir === DIRECCION_DERECHA ? DIRECCION_IZQUIERDA : DIRECCION_DERECHA;
  const cortarTick = () => {
    if (!tickAudioRef.current) return;
    tickAudioRef.current.pause();
    tickAudioRef.current.currentTime = 0;
  };

  const registrarMovimientoJugador = (dir) => {
    const historial = historialJugadorRef.current;

    if (dir === DIRECCION_DERECHA) {
      historial.derecha += 1;
    } else {
      historial.izquierda += 1;
    }

    if (historial.ultima === dir) {
      historial.racha += 1;
    } else {
      historial.racha = 1;
      historial.ultima = dir;
    }
  };

  const leerPerfilJugador = () => {
    const { izquierda, derecha, racha, ultima } = historialJugadorRef.current;
    const total = izquierda + derecha;

    if (total < 3) {
      return { tienePatron: false };
    }

    const dirPreferida =
      derecha === izquierda
        ? ultima ?? DIRECCION_DERECHA
        : derecha > izquierda
        ? DIRECCION_DERECHA
        : DIRECCION_IZQUIERDA;

    const diferencia = Math.abs(derecha - izquierda);
    const confianza = diferencia / total;
    const tienePatron = confianza >= 0.2 || racha >= 2;

    return {
      tienePatron,
      dirPreferida,
      confianza,
      racha,
    };
  };

  // 🎯 definir tiempo según dificultad
  const getTiempoRandom = () => {
    let min, max;

    if (dificultad === "facil") {
      min = 9000;
      max = 13000;
    } else if (dificultad === "medio") {
      min = 8000;
      max = 11000;
    } else {
      min = 7000;
      max = 9000;
    }

    return Math.random() * (max - min) + min;
  };

  // 🚀 iniciar ronda
  const iniciarRonda = () => {
    const tiempoRandom = getTiempoRandom();
    setTiempo(tiempoRandom);
    setInicio(Date.now());
    setGameOver(false);
    setDireccion(DIRECCION_DERECHA);
    setAvisoCambio("");
  };

  useEffect(() => {
    iniciarRonda();
  }, []);

  // 🔊 precargar sonidos
  useEffect(() => {
    tickAudioRef.current = new Audio("/tick.mp3");
    tickAudioRef.current.volume = 0.35;
    tickAudioRef.current.loop = false;
    tickAudioRef.current.preload = "auto";
    const onMetaData = () => {
      if (!tickAudioRef.current?.duration) return;
      const duracion = Math.round(tickAudioRef.current.duration * 1000);
      if (duracion > 0) {
        setTickDuracionMs(duracion);
      }
    };
    tickAudioRef.current.addEventListener("loadedmetadata", onMetaData);
    explosionAudioRef.current = new Audio("/explosion.mp3");

    return () => {
      tickAudioRef.current?.removeEventListener("loadedmetadata", onMetaData);
      cortarTick();
      explosionAudioRef.current?.pause();
    };
  }, []);

  // 💣 explosión con sonido (mantiene el tiempo real de la ronda)
  useEffect(() => {
    if (gameOver) return;

    const restante = tiempo - (Date.now() - inicio);
    if (restante <= 0) {
      cortarTick();
      explosionAudioRef.current?.play().catch(() => {});
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      cortarTick();
      explosionAudioRef.current?.play().catch(() => {});
      setGameOver(true);
    }, restante);

    return () => clearTimeout(timer);
  }, [tiempo, inicio, gameOver]);

  // ⏱ tick de bomba durante la ronda
  useEffect(() => {
    if (gameOver) return;

    let tickTimer;

    const reproducirTick = () => {
      const restante = tiempo - (Date.now() - inicio);
      if (restante <= 0) return;

      if (tickAudioRef.current) {
        tickAudioRef.current.currentTime = 0;
        tickAudioRef.current.play().catch(() => {});
      }

      // Ajusta la frecuencia al audio real: suena natural aunque cambies tick.mp3
      const progreso = 1 - restante / tiempo;
      const intervaloBase = Math.max(420, tickDuracionMs * 0.95);
      const intervaloMin = Math.max(150, tickDuracionMs * 0.35);
      const intervalo = Math.max(
        intervaloMin,
        intervaloBase - progreso * (intervaloBase - intervaloMin),
      );

      tickTimer = setTimeout(reproducirTick, intervalo);
    };

    reproducirTick();

    return () => {
      clearTimeout(tickTimer);
      cortarTick();
    };
  }, [tiempo, inicio, gameOver, tickDuracionMs]);

  // Corta cualquier cola de tick al terminar la ronda
  useEffect(() => {
    if (gameOver) {
      cortarTick();
    }
  }, [gameOver]);

  // 🤖 IA enemigos
  useEffect(() => {
    if (gameOver) return;

    const esJugador = bombaIndex === 0;

    if (!esJugador) {
      let tiempoIA =
        dificultad === "facil"
          ? Math.random() * 2000 + 1000
          : dificultad === "medio"
          ? Math.random() * 1500 + 500
          : Math.random() * 800 + 200;

      const iaTimer = setTimeout(() => {
        const pasosDerecha = (0 - bombaIndex + jugadores.length) % jugadores.length;
        const pasosIzquierda = (bombaIndex - 0 + jugadores.length) % jugadores.length;
        const direccionHaciaJugador =
          pasosDerecha < pasosIzquierda
            ? DIRECCION_DERECHA
            : pasosIzquierda < pasosDerecha
            ? DIRECCION_IZQUIERDA
            : Math.random() < 0.5
            ? DIRECCION_DERECHA
            : DIRECCION_IZQUIERDA;

        const perfilJugador = leerPerfilJugador();
        const probDesvio =
          dificultad === "facil" ? 0.2 : dificultad === "medio" ? 0.16 : 0.12;
        const probCambioSorpresa =
          dificultad === "facil" ? 0.16 : dificultad === "medio" ? 0.22 : 0.28;
        const probLecturaPatron =
          dificultad === "facil"
            ? 0.3
            : dificultad === "medio"
            ? 0.42
            : 0.55;

        let direccionIA = direccionHaciaJugador;
        let mensajeAviso = "";

        // Modo competitivo: si detecta patrón, intenta contrarrestarlo.
        if (
          perfilJugador.tienePatron &&
          Math.random() < probLecturaPatron * Math.max(0.7, perfilJugador.confianza + 0.6)
        ) {
          direccionIA = direccionOpuesta(perfilJugador.dirPreferida);
          mensajeAviso = "🧠 La IA leyó tu patrón";
        }

        // A veces se desvían para no ser totalmente predecibles.
        if (Math.random() < probDesvio) {
          direccionIA = direccionOpuesta(direccionIA);
          if (!mensajeAviso) {
            mensajeAviso = "🤖 El robot se desvió";
          }
        }

        // Más caos: cambios sorpresivos durante la cadena.
        if (Math.random() < probCambioSorpresa) {
          direccionIA = direccionOpuesta(direccionIA);
          mensajeAviso = "⚠️ ¡Cambio sorpresivo de sentido!";
        }

        setAvisoCambio(mensajeAviso);

        pasarBomba(direccionIA);
      }, tiempoIA);

      return () => clearTimeout(iaTimer);
    }
  }, [bombaIndex, direccion, dificultad, gameOver]);

  const moverIndice = (index, dir) =>
    (index + dir + jugadores.length) % jugadores.length;

  // 👉 pasar bomba (izquierda o derecha)
  const pasarBomba = (dirElegida = direccion) => {
    if (gameOver) return;

    if (bombaIndex === 0) {
      registrarMovimientoJugador(dirElegida);
    }

    setDireccion(dirElegida);
    setBombaIndex((prev) => moverIndice(prev, dirElegida));
  };

  // 🔁 reiniciar
  const reiniciar = () => {
    setBombaIndex(0);
    iniciarRonda();
  };

  // ⏱ tiempo restante
  const tiempoRestante = tiempo - (Date.now() - inicio);
  const enPeligro = tiempoRestante < 2000;

  return (
    <div className="game-shell">
      <div className="game-overlay" />
      <div className="container">
        <header className="game-hud">
          <h2 className="game-title">Bomba en Cadena</h2>
          <p className="game-turno">
            Turno: {jugadores[bombaIndex]} {bombaIndex === 0 && "(vos)"}
          </p>

          <div className="hud-row">
            <p className="badge">
              Dirección: {direccion === DIRECCION_DERECHA ? "➡️ derecha" : "⬅️ izquierda"}
            </p>
          </div>
          {avisoCambio && <p className="aviso-cambio">{avisoCambio}</p>}
        </header>

        <div className="grid">
          {jugadores.map((j, i) => (
            <div
              key={i}
              className={`player 
              ${i === bombaIndex ? "activo" : ""} 
              ${i === bombaIndex && enPeligro ? "peligro" : ""}
            `}
            >
              {j}
            </div>
          ))}
        </div>

        {gameOver ? (
          <>
            <h1 className="explosion">
              💥 Perdió {jugadores[bombaIndex]}
            </h1>
            <div className="acciones">
              <button onClick={reiniciar}>Reiniciar</button>
              <button onClick={() => setPantalla("menu")}>
                Volver al menú
              </button>
            </div>
          </>
        ) : (
          <>
            {bombaIndex === 0 ? (
              <div className="acciones">
                <button onClick={() => pasarBomba(DIRECCION_IZQUIERDA)}>
                  Pasar a la izquierda
                </button>
                <button onClick={() => pasarBomba(DIRECCION_DERECHA)}>
                  Pasar a la derecha
                </button>
              </div>
            ) : (
              <p className="pensando">🤖 Pensando...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Game;
