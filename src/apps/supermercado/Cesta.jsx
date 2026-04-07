import './Cesta.css'

const imagenesCanasta = {
  rojo: new URL('./ImgSuperColor/Canasta-Roja.png', import.meta.url).href,
  amarillo: new URL('./ImgSuperColor/Canasta-Amarilla.png', import.meta.url).href,
  morado: new URL('./ImgSuperColor/Canasta-Morada.png', import.meta.url).href,
}

function Cesta({ color, tono, titulo, dragActivo, estado, feedbackColor, onSoltar }) {
  const soltar = (event) => {
    event.preventDefault()
    const colorProducto = event.dataTransfer.getData('text/plain')
    // Validamos la fruta contra el color de esta cesta.
    onSoltar({ colorCesta: color, colorProducto })
  }

  const estadoVisual = feedbackColor === color ? `is-${estado}` : ''

  return (
    <article
      className={`cesta ${dragActivo ? 'is-ready' : ''} ${estadoVisual}`.trim()}
      style={{ '--cesta-color': tono }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={soltar}
    >
      <img className="cesta__imagen" src={imagenesCanasta[color]} alt={`Canasta ${titulo.toLowerCase()}`} />
      <strong>{titulo}</strong>
      <span>Suelta la fruta aqui</span>
    </article>
  )
}

export default Cesta
