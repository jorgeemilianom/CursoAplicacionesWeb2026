import Producto from './Producto'
import './BandaTransportadora.css'

const imagenBanda = new URL('../../../ImgSuperColor/Banda-Transportadora.png', import.meta.url).href

function BandaTransportadora({ dragActivo, onDragChange }) {
  const iniciar = (event) => {
    event.dataTransfer.setData('text/plain', producto.color)
    onDragChange(true)
  }

const BandaTransportadora = ({ productoActual }) => {
  return (
    <div style={estilos.banda}>
      <div style={estilos.riel}>
        {/* Renderizamos el componente Producto pasando los datos que recibimos del padre */}
        <Producto 
          emoji={productoActual.emoji} 
          nombre={productoActual.nombre} 
        />
      </div>
    </div>
  );
};

const estilos = {
  banda: {
    background: '#e0e0e0',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px auto',
    width: '80%',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
  },
  riel: {
    borderBottom: '5px solid #999',
    paddingBottom: '10px'
  }
};

export default BandaTransportadora;
