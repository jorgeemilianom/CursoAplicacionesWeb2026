import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function NotFound() {
  return (
    <div className="petbook-notfound">
      <div className="petbook-notfound__content">
        <div className="petbook-notfound__illustration">
          <span className="petbook-notfound__emoji">🐕‍🦺</span>
        </div>

        <h1 className="petbook-notfound__title">¡Ups! Esta página no existe</h1>
        <p className="petbook-notfound__subtitle">
          Tu mascota también se perdió buscándola 🐾
        </p>

        <Link to={PETBOOK_BASE_PATH}>
          <Button size="large">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
