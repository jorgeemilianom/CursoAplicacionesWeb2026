import { useEffect, useRef } from 'react'

function PantallaInicio({ alEmpezar }) {
  const botonRef = useRef(null)

  useEffect(() => {
    botonRef.current?.focus()
  }, [])

  return (
    <section className="inicio-screen" role="region" aria-label="Pantalla inicial del juego">
      <p className="descripcion">Escribe la palabra correcta para avanzar de nivel.</p>

      <button ref={botonRef} className="boton-empezar" onClick={alEmpezar} aria-label="Comenzar juego">
        Comenzar juego
      </button>
    </section>
  )
}

export default PantallaInicio
