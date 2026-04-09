import { useEffect, useRef } from 'react'

function PantallaInicio({ alEmpezar }) {
  const botonRef = useRef(null)

  useEffect(() => {
    botonRef.current?.focus()
  }, [])

  return (
    <section className="img1p__inicio" role="region" aria-label="Pantalla inicial del juego">
      <p className="img1p__descripcion">Escribe la palabra correcta para avanzar de nivel.</p>

      <button
        ref={botonRef}
        className="img1p__btn img1p__btn--primary"
        onClick={alEmpezar}
        aria-label="Comenzar juego"
      >
        Comenzar juego
      </button>
    </section>
  )
}

export default PantallaInicio
