import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={cerrarMenu}>
          <span className="navbar__logo-inicial">e</span>prenda
        </Link>

        <nav className={`navbar__nav ${menuAbierto ? 'navbar__nav--abierto' : ''}`}>
          <NavLink to="/" end onClick={cerrarMenu} className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--activo' : 'navbar__link'
          }>
            Inicio
          </NavLink>
          <a href="/#temario" onClick={cerrarMenu} className="navbar__link">Temario</a>
          <Link to="/apps" onClick={cerrarMenu} className="navbar__link">Aplicaciones</Link>
          <NavLink to="/docs" onClick={cerrarMenu} className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--activo' : 'navbar__link'
          }>
            Docs
          </NavLink>
          <a href="/#inscribirse" onClick={cerrarMenu} className="navbar__cta">Inscribirse</a>
        </nav>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
