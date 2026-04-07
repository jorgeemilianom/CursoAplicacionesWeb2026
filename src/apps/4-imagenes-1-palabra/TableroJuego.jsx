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
    <section className="img1p__tablero" role="region" aria-label={`Nivel ${datosNivel.id}`}>
      <div className="img1p__info-superior">
        <span aria-label={`Nivel ${datosNivel.id} de ${totalNiveles}`}>
          Nivel: {datosNivel.id} / {totalNiveles}
        </span>

        <span
          className={`img1p__temporizador ${tiempo < 10 ? 'img1p__temporizador--critico' : ''}`}
          aria-live={tiempo <= 5 ? 'assertive' : 'off'}
          aria-label={`${tiempo} segundos restantes`}
        >
          {tiempo}s
        </span>
      </div>

      <div className="img1p__barra-tiempo" aria-hidden="true">
        <div className="img1p__progreso-tiempo" style={{ width: `${porcentajeTiempo}%` }} />
      </div>

      <div className="img1p__contenedor-imagen-principal">
        <img src={datosNivel.imagen} alt={datosNivel.alt || 'Imagen de pista'} className="img1p__imagen-pistas" />
      </div>

      <div className="img1p__contenedor-espacios" aria-label={`Palabra de ${longitudPalabra} letras`} role="status">
        {datosNivel.palabra.split('').map((_, i) => (
          <span key={i} className={`img1p__espacio-letra ${letrasEscritas[i] ? 'img1p__espacio-letra--lleno' : ''}`} aria-hidden="true">
            {letrasEscritas[i] || '_'}
          </span>
        ))}
      </div>

      <div className="img1p__contenedor-entrada">
        <label htmlFor="input-palabra" className="img1p__sr-only">
          Escribe tu respuesta aqui
        </label>

        <input
          id="input-palabra"
          ref={inputRef}
          type="text"
          value={entrada}
          onChange={alCambiar}
          placeholder="Escribe la palabra"
          className={`img1p__entrada-palabra ${error ? 'img1p__entrada-palabra--error' : ''}`}
          aria-invalid={error}
          aria-describedby={error ? 'error-mensaje' : undefined}
          autoComplete="off"
          spellCheck="false"
        />

        {error && (
          <>
            <p className="img1p__mensaje-error">Incorrecto</p>

            <span id="error-mensaje" className="img1p__sr-only" role="alert">
              Palabra incorrecta, intenta de nuevo.
            </span>
          </>
        )}
      </div>
    </section>
  )
}

export default TableroJuego
