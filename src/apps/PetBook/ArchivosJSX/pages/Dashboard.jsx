import Card from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useAlertas } from '../../ArchivosJS/hooks/useAlertas'

function Dashboard() {
  const { mascotas, mascotaActiva } = useMascota()
  const { alertas } = useAlertas()

  return (
    <section className="petbook-page petbook-grid petbook-grid--dashboard">
      <Card title="Resumen general" subtitle="Estado de tu agenda digital">
        <div className="petbook-metrics">
          <div>
            <strong>{mascotas.length}</strong>
            <span>Mascotas registradas</span>
          </div>
          <div>
            <strong>{alertas.length}</strong>
            <span>Alertas activas</span>
          </div>
        </div>
      </Card>
      <Card title="Mascota activa" subtitle="Seleccion actual">
        <p>{mascotaActiva ? `${mascotaActiva.nombre} • ${mascotaActiva.raza}` : 'Todavia no hay mascota activa.'}</p>
        <ProgressBar value={mascotaActiva ? 75 : 20} />
      </Card>
    </section>
  )
}

export default Dashboard
