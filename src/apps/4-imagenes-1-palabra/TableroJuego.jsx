import { useEffect, useRef } from 'react'

function TableroJuego({ datosNivel, tiempo, entrada, alCambiar, error, totalNiveles }) {
  const inputRef = useRef(null)

  const letrasEscritas = entrada.toUpperCase().split('')
  const longitudPalabra = datosNivel.palabra.length

  useEffect(() => {
    inputRef.current?.focus()
  }, [datosNivel.id])

  const porcentajeTiempo = (tiempo / datosNivel.tiempo) * 100

  return (
    <section className="juego-tablero" role="region" aria-label={`Nivel ${datosNivel.id}`}>
      <div className="info-superior">
        <span aria-label={`Nivel ${datosNivel.id} de ${totalNiveles}`}>
          Nivel: {datosNivel.id} / {totalNiveles}
        </span>

        <span
          className={`temporizador ${tiempo < 10 ? 'tiempo-critico' : ''}`}
          aria-live={tiempo <= 5 ? 'assertive' : 'off'}
          aria-label={`${tiempo} segundos restantes`}
        >
          {tiempo}s
        </span>
      </div>

      <div className="barra-tiempo" aria-hidden="true">
        <div className="progreso-tiempo" style={{ width: `${porcentajeTiempo}%` }} />
      </div>

      <div className="contenedor-imagen-principal">
        <img src={datosNivel.imagen} alt={datosNivel.alt || 'Imagen de pista'} className="imagen-pistas" />
      </div>

      <div className="contenedor-espacios" aria-label={`Palabra de ${longitudPalabra} letras`} role="status">
        {datosNivel.palabra.split('').map((_, i) => (
          <span key={i} className={`espacio-letra ${letrasEscritas[i] ? 'lleno' : ''}`} aria-hidden="true">
            {letrasEscritas[i] || '_'}
          </span>
        ))}
      </div>

      <div className="contenedor-entrada">
        <label htmlFor="input-palabra" className="sr-only">
          Escribe tu respuesta aqui
        </label>

        <input
          id="input-palabra"
          ref={inputRef}
          type="text"
          value={entrada}
          onChange={alCambiar}
          placeholder="Escribe la palabra"
          className={`entrada-palabra ${error ? 'entrada-error' : ''}`}
          aria-invalid={error}
          aria-describedby={error ? 'error-mensaje' : undefined}
          autoComplete="off"
          spellCheck="false"
        />

        {error && (
          <>
            <p className="mensaje-error">Incorrecto</p>

            <span id="error-mensaje" className="sr-only" role="alert">
              Palabra incorrecta, intenta de nuevo.
            </span>
          </>
        )}
      </div>
    </section>
  )
}

export default TableroJuego
