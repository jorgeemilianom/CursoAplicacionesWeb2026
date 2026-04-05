import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import PantallaInicio from './PantallaInicio';
import TableroJuego from './TableroJuego';

import imagenRed from './assets/red.png';
import imagenEscala from './assets/escala.png';
import imagenCelula from './assets/celula.png';
import imagenCodigo from './assets/codigo.png';
import imagenCelebracion from './assets/celebracion.webp';
import sonidoVictoria from './assets/victoria.mp3';

const NIVELES = [
  { id: 1, palabra: 'RED', imagen: imagenRed, tiempo: 30, alt: 'Varias computadoras conectadas entre si formando una red' },
  { id: 2, palabra: 'ESCALA', imagen: imagenEscala, tiempo: 45, alt: 'Objeto con peldanos que se utiliza para subir a lugares altos' },
  { id: 3, palabra: 'CELULA', imagen: imagenCelula, tiempo: 45, alt: 'Vista microscopica de una celula biologica con su nucleo' },
  { id: 4, palabra: 'CODIGO', imagen: imagenCodigo, tiempo: 30, alt: 'Esquemas o simbolos que tienen un significado' },
];

function App({ onVolver }) {
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [nivelActual, setNivelActual] = useState(0);
  const [entradaUsuario, setEntradaUsuario] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(NIVELES[0].tiempo);
  const [celebrando, setCelebrando] = useState(false);
  const [error, setError] = useState(false);

  const audioVictoriaRef = useRef(null);
  const intervaloRef = useRef(null);
  const mainRef = useRef(null);

  const datosNivel = NIVELES[nivelActual];
  const juegoTerminado = tiempoRestante === 0;

  const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const esCorrecto = (valor) => normalizar(valor) === normalizar(datosNivel.palabra);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [juegoIniciado, celebrando, juegoTerminado]);

  useEffect(() => {
    audioVictoriaRef.current = new Audio(sonidoVictoria);
    audioVictoriaRef.current.preload = 'auto';

    return () => {
      if (audioVictoriaRef.current) {
        audioVictoriaRef.current.pause();
        audioVictoriaRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (juegoIniciado && nivelActual < NIVELES.length) {
      setTiempoRestante(NIVELES[nivelActual].tiempo);
      setEntradaUsuario('');
      setError(false);
    }
  }, [nivelActual, juegoIniciado]);

  useEffect(() => {
    if (!juegoIniciado || juegoTerminado || celebrando) {
      clearInterval(intervaloRef.current);
      return;
    }

    intervaloRef.current = setInterval(() => {
      setTiempoRestante((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(intervaloRef.current);
  }, [juegoIniciado, juegoTerminado, celebrando]);

  const iniciarJuego = () => {
    setJuegoIniciado(true);
    setNivelActual(0);
    setCelebrando(false);
  };

  const reiniciarJuego = () => {
    setJuegoIniciado(false);
    setNivelActual(0);
    setEntradaUsuario('');
    setTiempoRestante(NIVELES[0].tiempo);
    setCelebrando(false);
    setError(false);
  };

  const manejarAcierto = () => {
    if (audioVictoriaRef.current) {
      audioVictoriaRef.current.currentTime = 0;
      audioVictoriaRef.current.play().catch(() => {});
    }

    setCelebrando(true);

    setTimeout(() => {
      setCelebrando(false);
      setNivelActual((prev) => prev + 1);
    }, 3000);
  };

  const manejarCambio = (e) => {
    const valor = e.target.value.toUpperCase().trim();
    setEntradaUsuario(valor);

    if (esCorrecto(valor)) {
      manejarAcierto();
    } else {
      setError(valor.length >= datosNivel.palabra.length);
    }
  };

  return (
    <main className="juego-page" ref={mainRef} tabIndex="-1" aria-live="polite">
      <section className="juego-shell" aria-labelledby="titulo-juego">
        <header className="juego-header">
          <div>
            <h1 id="titulo-juego" className="juego-titulo">4 Imagenes 1 Palabra</h1>
            <p className="juego-subtitulo">Adivina la palabra a partir de la imagen antes de que termine el tiempo.</p>
          </div>

          {typeof onVolver === 'function' && (
            <button type="button" className="juego-boton-secundario" onClick={onVolver} aria-label="Volver al panel principal">
              Volver
            </button>
          )}
        </header>

        <section className="juego-contenido">
          {!juegoIniciado && <PantallaInicio alEmpezar={iniciarJuego} />}

          {juegoIniciado && celebrando && (
            <section role="alert" className="juego-estado">
              <h2>Correcto</h2>
              <img src={imagenCelebracion} alt="Ilustracion festiva por acertar la palabra" className="imagen-celebracion" />
            </section>
          )}

          {juegoIniciado && !celebrando && (juegoTerminado || nivelActual >= NIVELES.length) && (
            <section role="alert" className="juego-estado">
              <h2>{nivelActual >= NIVELES.length ? 'Felicitaciones, completaste el juego' : 'Tiempo agotado'}</h2>

              <button onClick={reiniciarJuego} aria-label="Reiniciar el juego desde el principio">
                Reintentar
              </button>
            </section>
          )}

          {juegoIniciado && !celebrando && !juegoTerminado && nivelActual < NIVELES.length && (
            <TableroJuego
              datosNivel={datosNivel}
              tiempo={tiempoRestante}
              entrada={entradaUsuario}
              alCambiar={manejarCambio}
              error={error}
              totalNiveles={NIVELES.length}
            />
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
