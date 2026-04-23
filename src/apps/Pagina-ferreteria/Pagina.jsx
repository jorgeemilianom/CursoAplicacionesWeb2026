import { useState, useEffect } from 'react'
import './styles/Pantalla.css'
import ChatBot from './components/ChatBot.jsx'
import Carousel from './components/Carousel.jsx'

const API_URL = 'https://69e8dd9b55d62f347979fb23.mockapi.io/Ferreteria/Ferreteria'
const CAROUSEL_URL = 'https://69e8dd9b55d62f347979fb23.mockapi.io/Ferreteria/Carousel'

const normalizeImageUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return ''
  }

  return value.trim()
}

const ensureArray = (value) => (Array.isArray(value) ? value : [])

function Pagina() {
  const [productos, setProductos] = useState([])
  const [carouselSlides, setCarouselSlides] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosResponse, carouselResponse] = await Promise.allSettled([
          fetch(API_URL),
          fetch(CAROUSEL_URL),
        ]);

        let productosData = [];
        let carouselData = [];

        if (productosResponse.status === "fulfilled") {
          if (!productosResponse.value.ok) {
            throw new Error(`Error al cargar productos: ${productosResponse.value.status}`);
          }

          productosData = ensureArray(await productosResponse.value.json());
        } else {
          throw productosResponse.reason;
        }

        if (carouselResponse.status === "fulfilled") {
          if (carouselResponse.value.ok) {
            carouselData = ensureArray(await carouselResponse.value.json());
          }
        }

        const adaptados = productosData.map((p, index) => ({
          id: p.id || index,
          name: p.nombre || p.name || `Producto ${index + 1}`,
          price: Number(p.precio ?? p.price ?? 0),
          img: normalizeImageUrl(p.imagenUrl || p.img || p.image),
          categoria: p.categoria || p.category || 'herramientas',
          stock: p.stock ?? 0,
          descripcion: p.descripcion || p.description || 'Sin descripcion disponible.',
        }))

        const carouselAdaptado = carouselData.map((slide, index) => ({
          id: slide.id || `slide-${index}`,
          imagenUrl: normalizeImageUrl(slide.imagenUrl || slide.image || slide.img),
          titulo: slide.titulo || slide.nombre || slide.title || `Slide ${index + 1}`,
          descripcion: slide.descripcion || slide.description || 'Descubri productos destacados de la ferreteria.',
          categoria: slide.categoria || slide.category || '',
        }))

        setProductos(adaptados)
        setCarouselSlides(carouselAdaptado)
        setError(false)
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar productos:', error)
        setError(true)
        setProductos([])
        setCarouselSlides([])
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const addToCart = (product) => {
    setCart((currentCart) => [...currentCart, product])
  }

  const total = cart.reduce((acc, item) => acc + item.price, 0)

  return (
    <div className="ferreteria-app">
      <div className="ferreteria-app__page">
        <nav className="ferreteria-app__header">
          <div className="ferreteria-app__header-container">
            <div className="ferreteria-app__brand">
              <span className="ferreteria-app__eyebrow">Catalogo ferretero</span>
              <h1 className="ferreteria-app__logo">FERRETRIA EL VIEJO VITE 🛠️</h1>
            </div>
            <button className="ferreteria-app__cart-button">
              <span className="ferreteria-app__cart-label">🛒 Carrito</span>
              <span className="ferreteria-app__cart-count">{cart.length}</span>
              <span className="ferreteria-app__cart-total">Total: ${total}</span>
            </button>
          </div>
        </nav>

        <section className="ferreteria-app__hero">
          <div className="ferreteria-app__hero-content">
            <div className="ferreteria-app__hero-layout">
              <div className="ferreteria-app__hero-copy">
                <span className="ferreteria-app__hero-badge">Stock actualizado</span>
                <h2 className="ferreteria-app__hero-title">Herramientas profesionales para cada proyecto</h2>
                <p className="ferreteria-app__hero-subtitle">
                  Explora productos conectados a tu API con una experiencia mas clara, rapida y visual.
                </p>
                <div className="ferreteria-app__hero-metrics">
                  <div className="ferreteria-app__hero-metric">
                    <strong className="ferreteria-app__hero-metric-value">{productos.length}</strong>
                    <span className="ferreteria-app__hero-metric-label">productos</span>
                  </div>
                  <div className="ferreteria-app__hero-metric">
                    <strong className="ferreteria-app__hero-metric-value">{cart.length}</strong>
                    <span className="ferreteria-app__hero-metric-label">en carrito</span>
                  </div>
                </div>
              </div>

              <div className="ferreteria-app__hero-media">
                <Carousel slides={carouselSlides} />
              </div>
            </div>
          </div>
        </section>

        <main className="ferreteria-app__catalog">
          <div className="ferreteria-app__catalog-intro">
            <span className="ferreteria-app__catalog-kicker">Catalogo</span>
            <h2 className="ferreteria-app__catalog-title">Productos destacados</h2>
          </div>

          {loading ? (
            <p className="ferreteria-app__catalog-status">Cargando productos...</p>
          ) : error ? (
            <p className="ferreteria-app__catalog-status ferreteria-app__catalog-status--error">
              No se pudieron cargar los productos.
            </p>
          ) : (
            <div className="ferreteria-app__catalog-grid">
              {productos.map((p) => (
                <div key={p.id} className="ferreteria-app__card">
                  <img src={p.img} alt={p.name} className="ferreteria-app__card-image" />

                  <div className="ferreteria-app__card-body">
                    <div className="ferreteria-app__card-meta">
                      <span className="ferreteria-app__card-tag">{p.categoria}</span>
                      <span className="ferreteria-app__card-stock">Stock: {p.stock}</span>
                    </div>

                    <h3 className="ferreteria-app__card-product-name">{p.name}</h3>
                    <p className="ferreteria-app__card-description">{p.descripcion}</p>
                    <strong className="ferreteria-app__card-price ferreteria-app__card-price--highlight">${p.price}</strong>

                    <button className="ferreteria-app__card-button ferreteria-app__card-button--add" onClick={() => addToCart(p)}>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <ChatBot productos={productos} addToCart={addToCart} />

        <footer className="ferreteria-app__footer">
          <p>© 2026 FERRETRIA EL VIEJO VITE</p>
        </footer>
      </div>
    </div>
  )
}

export default Pagina
