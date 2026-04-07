import './Producto.css'

const imagenesFruta = {
  manzana: new URL('./ImgSuperColor/Manzana.png', import.meta.url).href,
  platano: new URL('./ImgSuperColor/Banana.png', import.meta.url).href,
  uva: new URL('./ImgSuperColor/Uva.png', import.meta.url).href,
  frutilla: new URL('./ImgSuperColor/Frutilla.png', import.meta.url).href,
  limon: new URL('./ImgSuperColor/Limon.png', import.meta.url).href,
}

function Producto({ producto }) {
  const claseFruta = producto.nombre.toLowerCase()

  return (
    <article className={`producto producto--${producto.color} producto--${claseFruta}`}>
      <img className="producto__imagen" src={imagenesFruta[claseFruta]} alt={producto.nombre} />
      <div className="producto__texto">
        <h3>{producto.nombre}</h3>
      </div>
    </article>
  )
}

export default Producto
