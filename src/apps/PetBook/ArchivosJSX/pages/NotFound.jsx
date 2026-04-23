import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function NotFound() {
  return (
    <section className="petbook-page">
      <Card title="404" subtitle="La ruta que buscabas no existe dentro de PetBook.">
        <Link to={PETBOOK_BASE_PATH}>
          <Button>Volver al inicio</Button>
        </Link>
      </Card>
    </section>
  )
}

export default NotFound
