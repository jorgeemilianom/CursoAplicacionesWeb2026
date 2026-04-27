import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function Home() {
  const carouselImages = [
    new URL('../../ImgPet/PetCarrusel01.png', import.meta.url).href,
    new URL('../../ImgPet/PetCarrusel02.png', import.meta.url).href,
    new URL('../../ImgPet/PetCarrusel03.png', import.meta.url).href,
    new URL('../../ImgPet/PetCarrusel04.png', import.meta.url).href,
  ]
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselImages.length)
    }, 4500)

    return () => clearInterval(interval)
  }, [carouselImages.length])

  return (
    <div className="petbook-landing">
      {/* Hero Section */}
      <section className="petbook-hero">
        <div className="petbook-hero__content">
          <div className="petbook-hero__logo">
            <span className="petbook-hero__emoji">🐾</span>
            <h1 className="petbook-hero__title">PetBook</h1>
          </div>
          <h2 className="petbook-hero__tagline">
            La salud de tu mascota, siempre organizada
          </h2>
          <p className="petbook-hero__subtitle">
            Vacunas, turnos, gestación y más. Todo en un lugar.
          </p>
          <div className="petbook-hero__actions">
            <Link to={`${PETBOOK_BASE_PATH}/registro`}>
              <Button size="large">Crear cuenta gratis</Button>
            </Link>
            <Button variant="outline" size="large">Ver demo</Button>
          </div>
          <div className="petbook-hero__carousel">
            {carouselImages.map((src, index) => (
              <div
                key={index}
                className={`petbook-carousel__item ${index === activeIndex ? 'is-active' : ''}`}
              >
                <img src={src} alt={`Pet carrusel ${index + 1}`} />
              </div>
            ))}
            <div className="petbook-carousel__dots">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`petbook-carousel__dot ${index === activeIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Mostrar imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="petbook-hero__image">
          {/* Placeholder para imagen hero */}
          <div className="petbook-hero__placeholder">
            <span>🐕‍🦺</span>
            <p>Ilustración de mascota con dueño feliz</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="petbook-features">
        <div className="petbook-container">
          <h2>Todo lo que necesitas para cuidar mejor a tu mascota</h2>
          <div className="petbook-features__grid">
            <Card className="petbook-feature-card petbook-feature-card--vacunas">
              <div className="petbook-feature-card__icon">💉</div>
              <h3>Historial de vacunas</h3>
              <p>Seguimiento completo de todas las vacunas aplicadas y próximas.</p>
            </Card>

            <Card className="petbook-feature-card petbook-feature-card--calendario">
              <div className="petbook-feature-card__icon">📅</div>
              <h3>Calendario inteligente</h3>
              <p>Recordatorios automáticos de vacunas, consultas y tratamientos.</p>
            </Card>

            <Card className="petbook-feature-card petbook-feature-card--gestacion">
              <div className="petbook-feature-card__icon">🤰</div>
              <h3>Seguimiento de gestación</h3>
              <p>Línea de tiempo completa para el embarazo de tu mascota.</p>
            </Card>

            <Card className="petbook-feature-card petbook-feature-card--veterinarias">
              <div className="petbook-feature-card__icon">🗺️</div>
              <h3>Veterinarias cercanas</h3>
              <p>Encuentra clínicas veterinarias cerca de tu ubicación.</p>
            </Card>

            <Card className="petbook-feature-card petbook-feature-card--asistente">
              <div className="petbook-feature-card__icon">🤖</div>
              <h3>Asistente con IA</h3>
              <p>Consultas sobre salud, alimentación y comportamiento.</p>
            </Card>

            <Card className="petbook-feature-card petbook-feature-card--alertas">
              <div className="petbook-feature-card__icon">🔔</div>
              <h3>Alertas automáticas</h3>
              <p>Notificaciones por email y recordatorios personalizados.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="petbook-how-it-works">
        <div className="petbook-container">
          <h2>¿Cómo funciona?</h2>
          <div className="petbook-steps">
            <div className="petbook-step">
              <div className="petbook-step__number">1</div>
              <h3>Registra a tu mascota</h3>
              <p>Crea el perfil de tu compañero con toda su información básica.</p>
            </div>

            <div className="petbook-step">
              <div className="petbook-step__number">2</div>
              <h3>Carga su historial de salud</h3>
              <p>Agrega vacunas, consultas veterinarias y tratamientos previos.</p>
            </div>

            <div className="petbook-step">
              <div className="petbook-step__number">3</div>
              <h3>Recibe alertas automáticas</h3>
              <p>PetBook te avisa cuando llegue el momento de vacunar o consultar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="petbook-cta">
        <div className="petbook-container">
          <h2>¿Listo para cuidar mejor a tu mascota?</h2>
          <p>Únete a miles de dueños que ya confían en PetBook para la salud de sus compañeros.</p>
          <Link to={`${PETBOOK_BASE_PATH}/registro`}>
            <Button size="large">Comenzar gratis</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="petbook-footer">
        <div className="petbook-container">
          <div className="petbook-footer__content">
            <div className="petbook-footer__brand">
              <span className="petbook-footer__logo">🐾 PetBook</span>
              <p>La agenda digital de salud para mascotas</p>
            </div>

            <div className="petbook-footer__links">
              <div className="petbook-footer__section">
                <h4>Producto</h4>
                <a href="#features">Funciones</a>
                <a href="#pricing">Precios</a>
                <a href="#demo">Demo</a>
              </div>

              <div className="petbook-footer__section">
                <h4>Soporte</h4>
                <a href="#help">Ayuda</a>
                <a href="#contact">Contacto</a>
                <a href="#faq">Preguntas frecuentes</a>
              </div>

              <div className="petbook-footer__section">
                <h4>Legal</h4>
                <a href="#privacy">Privacidad</a>
                <a href="#terms">Términos</a>
                <a href="#cookies">Cookies</a>
              </div>
            </div>

            <div className="petbook-footer__social">
              <h4>Síguenos</h4>
              <div className="petbook-footer__social-links">
                <a href="#facebook">📘 Facebook</a>
                <a href="#instagram">📷 Instagram</a>
                <a href="#twitter">🐦 Twitter</a>
              </div>
            </div>
          </div>

          <div className="petbook-footer__bottom">
            <p>&copy; 2024 PetBook. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
