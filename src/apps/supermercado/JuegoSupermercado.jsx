import { useState } from 'react'
import { Link } from 'react-router-dom'
import Marcador from './Marcador'
import BandaTransportadora from './BandaTransportadora'
import Cesta from './Cesta'
import './JuegoSupermercado.css'

const imagenFinal = new URL('./ImgSuperColor/Fin-del-juego.png', import.meta.url).href

const PRODUCTOS = [
  { id: 1, nombre: 'Manzana', color: 'rojo', colorTexto: 'roja', icono: 'MAN', tono: '#ef4444', articulo: 'La' },
  { id: 2, nombre: 'Platano', color: 'amarillo', colorTexto: 'amarillo', icono: 'PLA', tono: '#facc15', articulo: 'El' },
  { id: 3, nombre: 'Uva', color: 'morado', colorTexto: 'morada', icono: 'UVA', tono: '#a855f7', articulo: 'La' },
  { id: 4, nombre: 'Frutilla', color: 'rojo', colorTexto: 'roja', icono: 'FRU', tono: '#ef4444', articulo: 'La' },
  { id: 5, nombre: 'Limon', color: 'amarillo', colorTexto: 'amarillo', icono: 'LIM', tono: '#facc15', articulo: 'El' },
]

const crearPista = ({ articulo, nombre, colorTexto }) => `${articulo} ${nombre.toLowerCase()} ${colorTexto} va en la cesta del color correcto.`
const mezclarProductos = () => [...PRODUCTOS].sort(() => Math.random() - 0.5)

function JuegoSupermercado() {
  const [productos, setProductos] = useState(() => mezclarProductos())
  const [indice, setIndice] = useState(0)
  const [puntos, setPuntos] = useState(0)
  const [dragActivo, setDragActivo] = useState(false)
  const [estado, setEstado] = useState('idle')
  const [feedbackColor, setFeedbackColor] = useState('')
  const productoActual = productos[indice]
  const meta = productos.length
  const completado = puntos >= meta
  const mensajeBase = productoActual ? crearPista(productoActual) : 'Lleva la fruta a la cesta correcta.'
  const [mensaje, setMensaje] = useState(mensajeBase)

  const reiniciar = () => {
    const productosMezclados = mezclarProductos()
    setProductos(productosMezclados)
    setIndice(0); setPuntos(0); setDragActivo(false)
    setEstado('idle'); setFeedbackColor(''); setMensaje(crearPista(productosMezclados[0]))
  }

  const manejarCesta = ({ colorCesta, colorProducto }) => {
    if (completado || !colorProducto || !productoActual) return
    const acierto = colorCesta === colorProducto
    setEstado(acierto ? 'acierto' : 'error')
    setFeedbackColor(colorCesta)
    setDragActivo(false)
    if (!acierto) return setMensaje(`${mensajeBase} Mira bien el color e intenta otra vez.`)
    const siguientes = puntos + 1
    if (siguientes >= meta) {
      setPuntos(siguientes); setEstado('victoria'); setMensaje('Muy bien. Completaste todo el supermercado.')
      return
    }
    const siguienteIndice = indice + 1
    setPuntos(siguientes)
    setIndice(siguienteIndice)
    setMensaje(`Muy bien. ${crearPista(productos[siguienteIndice])}`)
  }

  return (
    <section className={`supermercado-juego is-${estado}`}>
      <div className="supermercado-juego__escena">
        <Link to="/apps" className="supermercado-juego__volver">{'<- '}Volver a aplicaciones</Link>
        <header className="supermercado-juego__hero">
          <p className="supermercado-juego__eyebrow">Juego educativo</p>
          <h1>Supermercado de Colores</h1>
          <p>Mira la fruta y arrastrala a la cesta del mismo color.</p>
        </header>
        <Marcador puntos={puntos} mensaje={mensaje} meta={meta} estado={estado} />
        {completado ? (
          <section className="supermercado-juego__final">
            <img className="supermercado-juego__final-imagen" src={imagenFinal} alt="Pantalla final del supermercado" />
            <h2>Completaste el supermercado</h2>
            <p>Ordenaste todas las frutas por color. Juega otra vez para seguir aprendiendo.</p>
            <button type="button" onClick={reiniciar}>Jugar otra vez</button>
          </section>
        ) : (
          <>
            <BandaTransportadora producto={productoActual} dragActivo={dragActivo} onDragChange={setDragActivo} />
            <div className="supermercado-juego__cestas">
              <Cesta color="rojo" tono="#ef4444" titulo="Roja" dragActivo={dragActivo} estado={estado} feedbackColor={feedbackColor} onSoltar={manejarCesta} />
              <Cesta color="amarillo" tono="#facc15" titulo="Amarilla" dragActivo={dragActivo} estado={estado} feedbackColor={feedbackColor} onSoltar={manejarCesta} />
              <Cesta color="morado" tono="#a855f7" titulo="Morada" dragActivo={dragActivo} estado={estado} feedbackColor={feedbackColor} onSoltar={manejarCesta} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default JuegoSupermercado
