import Card from '../components/ui/Card'
import { useUser } from '../../ArchivosJS/hooks/useUser'

function Configuracion() {
  const { user } = useUser()

  return (
    <section className="petbook-page">
      <Card title="Configuracion" subtitle="Datos iniciales de la cuenta">
        <div className="petbook-definition-list">
          <span>Nombre</span>
          <strong>{user?.nombre || 'Sin dato'}</strong>
          <span>Email</span>
          <strong>{user?.email || 'Sin dato'}</strong>
          <span>Ubicacion</span>
          <strong>{user?.ubicacion || 'Sin dato'}</strong>
        </div>
      </Card>
    </section>
  )
}

export default Configuracion
