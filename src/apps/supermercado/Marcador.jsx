import './Marcador.css'

function Marcador({ puntos, mensaje, meta, estado }) {
  return (
    <section className={`marcador is-${estado}`}>
      <div className="marcador__panel">
        <span>Aciertos</span>
        <strong>{puntos}</strong>
      </div>
      <div className="marcador__panel">
        <span>Meta</span>
        <strong>{puntos}/{meta}</strong>
      </div>
      <div className="marcador__mensaje">
        <span>Pista</span>
        <p>{mensaje}</p>
      </div>
    </section>
  )
}

export default Marcador
