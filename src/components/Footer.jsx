import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__logo">
            <span>e</span>prenda
          </span>
          <p>Formando los desarrolladores web del futuro.</p>
        </div>

        <div className="footer__links">
          <h4>Curso</h4>
          <ul>
            <li><a href="/#temario">Temario</a></li>
            <li><a href="/#features">Beneficios</a></li>
            <li><a href="/#inscribirse">Inscribirse</a></li>
          </ul>
        </div>

        <div className="footer__links">
          <h4>Recursos</h4>
          <ul>
            <li><Link to="/apps">Aplicaciones prácticas</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2026 Eprenda. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
