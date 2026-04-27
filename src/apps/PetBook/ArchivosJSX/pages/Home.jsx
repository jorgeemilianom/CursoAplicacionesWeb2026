import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'
import img1 from '../../ImgPet/PetCarrusel01.png'
import img2 from '../../ImgPet/PetCarrusel02.png'
import img3 from '../../ImgPet/PetCarrusel03.png'
import img4 from '../../ImgPet/PetCarrusel04.png'
import imgVacunas from '../../ImgPet/PetCuidar01.png'
import imgCalendario from '../../ImgPet/PetCuidar02.png'
import imgGestacion from '../../ImgPet/PetCuidar03.png'
import imgVeterinarias from '../../ImgPet/PetCuidar04.png'
import imgAsistente from '../../ImgPet/PetCuidar05.png'
import imgAlertas from '../../ImgPet/PetCuidar06.png'

function Home() {
  const imagenes = [img1, img2, img3, img4]
  const [indiceActivo, setIndiceActivo] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setIndiceActivo((prev) => (prev + 1) % imagenes.length)
        setFadeIn(true)
      }, 600)
    }, 5000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="petbook-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-card-oscura">
          <h1 className="hero-titulo">
            <span className="hero-titulo-icono">🐾</span> PetBook
          </h1>
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
            <Link to={`${PETBOOK_BASE_PATH}/login`}>
              <Button variant="outline" size="large">Ver demo</Button>
            </Link>
          </div>
        </div>

        <div className="carrusel-wrapper">
          <img
            src={imagenes[indiceActivo]}
            alt={`Slide ${indiceActivo + 1}`}
            className={`carrusel-imagen ${fadeIn ? 'visible' : 'oculta'}`}
          />
        </div>

        <div className="carrusel-indicadores">
          {imagenes.map((_, i) => (
            <button
              key={i}
              className={`indicador ${i === indiceActivo ? 'activo' : ''}`}
              onClick={() => {
                setFadeIn(false)
                setTimeout(() => {
                  setIndiceActivo(i)
                  setFadeIn(true)
                }, 300)
              }}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>

        <div className="hero-ola">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="petbook-features">
        <div className="petbook-container">
          <h3 className="petbook-features__title">Todo lo que necesitas para cuidar mejor a tu mascota</h3>
          <div className="petbook-features__grid">
            <div
              className="feature-card"
              style={{ backgroundImage: `url(${imgVacunas})` }}
            >
              <div className="feature-card-overlay">
                <span className="feature-card-icono">💉</span>
                <h3 className="feature-card-titulo">Historial de vacunas</h3>
                <p className="feature-card-descripcion">
                  Seguimiento completo de todas las vacunas
                  aplicadas y próximas.
                </p>
              </div>
            </div>

            <div
              className="feature-card"
              style={{ backgroundImage: `url(${imgCalendario})` }}
            >
              <div className="feature-card-overlay">
                <span className="feature-card-icono">📅</span>
                <h3 className="feature-card-titulo">Calendario inteligente</h3>
                <p className="feature-card-descripcion">
                  Recordatorios automáticos de vacunas,
                  consultas y tratamientos.
                </p>
              </div>
            </div>

            <div
              className="feature-card"
              style={{ backgroundImage: `url(${imgGestacion})` }}
            >
              <div className="feature-card-overlay">
                <span className="feature-card-icono">🤰</span>
                <h3 className="feature-card-titulo">Seguimiento de gestación</h3>
                <p className="feature-card-descripcion">
                  Línea de tiempo completa para el
                  embarazo de tu mascota.
                </p>
              </div>
            </div>

            <div
              className="feature-card"
              style={{ backgroundImage: `url(${imgVeterinarias})` }}
            >
              <div className="feature-card-overlay">
                <span className="feature-card-icono">🗺️</span>
                <h3 className="feature-card-titulo">Veterinarias cercanas</h3>
                <p className="feature-card-descripcion">
                  Encuentra clínicas veterinarias
                  cerca de tu ubicación.
                </p>
              </div>
            </div>

            <div
              className="feature-card"
              style={{ backgroundImage: `url(${imgAsistente})` }}
            >
              <div className="feature-card-overlay">
                <span className="feature-card-icono">🤖</span>
                <h3 className="feature-card-titulo">Asistente con IA</h3>
                <p className="feature-card-descripcion">
                  Consultas sobre salud, alimentación
                  y comportamiento.
                </p>
              </div>
            </div>

            <div
              className="feature-card"
              style={{ backgroundImage: `url(${imgAlertas})` }}
            >
              <div className="feature-card-overlay">
                <span className="feature-card-icono">🔔</span>
                <h3 className="feature-card-titulo">Alertas automáticas</h3>
                <p className="feature-card-descripcion">
                  Notificaciones por email y
                  recordatorios personalizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
