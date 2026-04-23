import { Link } from 'react-router-dom'
import { useVacunas } from '../../../ArchivosJS/hooks/useVacunas'
import { calcularEdad } from '../../../ArchivosJS/utils/fechas'
import { PETBOOK_BASE_PATH, SPECIES_AVATARS } from '../../../ArchivosJS/utils/constants'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

function getEstadoBadge(estado) {
  if (estado === 'vencido') {
    return { tipo: 'danger', texto: 'Vencido' }
  }

  if (estado === 'atencion') {
    return { tipo: 'warning', texto: 'Atencion requerida' }
  }

  return { tipo: 'success', texto: 'Al dia' }
}

function MascotaCard({ mascota }) {
  const { estadoGeneral } = useVacunas(mascota.id)
  const badge = getEstadoBadge(estadoGeneral)

  return (
    <Card title={mascota.nombre} subtitle={`${mascota.raza || 'Raza no definida'} • ${calcularEdad(mascota.fechaNacimiento)}`}>
      <div className="petbook-stack petbook-card-pet">
        <div className="petbook-pet-avatar">
          {mascota.foto ? (
            <img src={mascota.foto} alt={mascota.nombre} />
          ) : (
            <span>{SPECIES_AVATARS[mascota.especie] || SPECIES_AVATARS.otro}</span>
          )}
        </div>
        <div className="petbook-inline">
          <Badge tipo={badge.tipo} texto={badge.texto} />
          <span>{mascota.sexo}</span>
          <span>{mascota.peso} kg</span>
        </div>
        <p>{mascota.veterinario ? `Veterinario: ${mascota.veterinario}` : 'Sin veterinario asignado por ahora.'}</p>
        <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/mascotas/${mascota.id}`}>
          Ver ficha completa
        </Link>
      </div>
    </Card>
  )
}

export default MascotaCard
