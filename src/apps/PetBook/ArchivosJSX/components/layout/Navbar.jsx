import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { useUser } from '../../../ArchivosJS/hooks/useUser'
import { PETBOOK_BASE_PATH } from '../../../ArchivosJS/utils/constants'

function Navbar() {
  const { user, isAuthenticated, logout } = useUser()

  return (
    <header className="petbook-topbar">
      <Link className="petbook-brand" to={PETBOOK_BASE_PATH}>
        <span>PetBook</span>
        <small>Agenda digital</small>
      </Link>
      <div className="petbook-topbar__actions">
        {isAuthenticated ? (
          <>
            <span className="petbook-user-chip">{user?.nombre}</span>
            <Button variant="ghost" onClick={logout}>
              Cerrar sesion
            </Button>
          </>
        ) : (
          <>
            <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/login`}>
              Iniciar sesion
            </Link>
            <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/registro`}>
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
