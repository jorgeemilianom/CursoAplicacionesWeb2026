import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import { useGestacion } from '../../ArchivosJS/hooks/useGestacion'
import { formatearFecha } from '../../ArchivosJS/utils/fechas'

function Gestacion() {
  const { mascotaId } = useParams()
  const { gestaciones, loading } = useGestacion(mascotaId)

  if (loading) return <Loader label="Cargando gestacion..." />

  return (
    <section className="petbook-page">
      <div className="petbook-grid">
        {gestaciones.map((gestacion) => (
          <Card key={gestacion.id} title="Seguimiento de gestacion" subtitle={`Cruce: ${formatearFecha(gestacion.fechaCruce)}`}>
            <p>Semana actual: {gestacion.semanas}</p>
            <p>Parto probable: {formatearFecha(gestacion.fechaPartoProbable)}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Gestacion
