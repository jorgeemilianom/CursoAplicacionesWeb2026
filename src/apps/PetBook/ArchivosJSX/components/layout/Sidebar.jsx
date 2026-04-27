import { NavLink } from 'react-router-dom'
import { LINKS_PRIVADOS, PETBOOK_BASE_PATH } from '../../../ArchivosJS/utils/constants'

function Sidebar() {
  return (
    <aside className="petbook-sidebar">
      <p className="petbook-sidebar__label">Panel</p>
      <nav className="petbook-sidebar__nav">
        {LINKS_PRIVADOS.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) => `petbook-sidebar__link ${isActive ? 'is-active' : ''}`}
            to={`${PETBOOK_BASE_PATH}${link.to}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
