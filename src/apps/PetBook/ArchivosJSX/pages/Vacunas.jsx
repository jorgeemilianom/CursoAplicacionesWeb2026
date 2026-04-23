import { useParams } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import { useVacunas } from '../../ArchivosJS/hooks/useVacunas'
import { formatearFecha } from '../../ArchivosJS/utils/fechas'

function Vacunas() {
  const { mascotaId } = useParams()
  const { vacunas, loading } = useVacunas(mascotaId)

  if (loading) return <Loader label="Cargando vacunas..." />

  return (
    <section className="petbook-page">
      <div className="petbook-grid">
        {vacunas.map((vacuna) => (
          <Card key={vacuna.id} title={vacuna.nombre} subtitle={`Aplicada: ${formatearFecha(vacuna.fecha)}`}>
            <div className="petbook-stack">
              <Badge tone={vacuna.vencida ? 'danger' : 'success'}>
                {vacuna.vencida ? 'Vencida' : `Proxima ${formatearFecha(vacuna.proxima)}`}
              </Badge>
              <p>Veterinario: {vacuna.veterinario}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Vacunas
