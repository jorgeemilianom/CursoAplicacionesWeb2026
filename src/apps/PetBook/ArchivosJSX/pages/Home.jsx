import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function Home() {
  return (
    <section className="petbook-landing">
      <div className="petbook-landing__copy">
        <span className="petbook-kicker">Etapa 1</span>
        <h1>La agenda digital de salud para quienes cuidan mascotas en serio.</h1>
        <p>
          PetBook ya tiene base de arquitectura, login, rutas privadas y contexto listo para empezar las
          siguientes etapas.
        </p>
        <div className="petbook-inline">
          <Link to={`${PETBOOK_BASE_PATH}/login`}>
            <Button>Entrar</Button>
          </Link>
          <Link to={`${PETBOOK_BASE_PATH}/registro`}>
            <Button variant="secondary">Crear cuenta</Button>
          </Link>
        </div>
      </div>
      <Card title="Lo que ya funciona" subtitle="Checklist inicial">
        <ul className="petbook-list">
          <li>JSON Server en puerto 3001</li>
          <li>Axios centralizado</li>
          <li>Contextos de usuario, mascotas y alertas</li>
          <li>Navegacion publica y privada</li>
        </ul>
      </Card>
    </section>
  )
}

export default Home
