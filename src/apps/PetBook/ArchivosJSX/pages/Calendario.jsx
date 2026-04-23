import { useAlertas } from '../../ArchivosJS/hooks/useAlertas'
import PagePlaceholder from '../components/shared/PagePlaceholder'

function Calendario() {
  const { alertas } = useAlertas()

  return (
    <PagePlaceholder
      title="Calendario"
      description="Vista inicial de seguimiento para vacunas, gestaciones y recordatorios."
      extra={<p>Eventos detectados hoy: {alertas.length}</p>}
    />
  )
}

export default Calendario
