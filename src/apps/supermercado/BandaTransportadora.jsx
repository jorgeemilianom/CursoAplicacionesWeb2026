import Producto from './Producto'
import './BandaTransportadora.css'

const imagenBanda = new URL('../../../ImgSuperColor/Banda-Transportadora.png', import.meta.url).href

function BandaTransportadora({ dragActivo, onDragChange }) {
  const iniciar = (event) => {
    event.dataTransfer.setData('text/plain', producto.color)
    onDragChange(true)
  }

  return (
    <section className="banda">
      <div className="banda__cartel">
        <span>Fruta para ordenar</span>
        <strong>{producto.nombre}</strong>
      </div>
      <div className={`banda__pista ${dragActivo ? 'is-dragging' : ''}`}>
        <div className="banda__cinta" style={{ backgroundImage: `url(${imagenBanda})` }} />
        <div className="banda__producto" draggable onDragStart={iniciar} onDragEnd={() => onDragChange(false)}>
          <Producto producto={producto} />
        </div>
      </div>
    </section>
  )
}

export default BandaTransportadora
