import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import MascotaCard from '../components/shared/MascotaCard'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function MisMascotas() {
  const { mascotas, loading } = useMascota()

  if (loading) {
    return <Loader label="Cargando mascotas..." />
  }

  return (
    <section className="petbook-page">
      <header className="petbook-page-header">
        <div>
          <p className="petbook-kicker">Mis Mascotas</p>
          <h2>Tu panel de companeras de vida</h2>
        </div>
        <Link to={`${PETBOOK_BASE_PATH}/mascotas/nueva`}>
          <Button>Agregar mascota</Button>
        </Link>
      </header>

      {mascotas.length === 0 ? (
        <section className="petbook-empty-state">
          <div className="petbook-empty-state__icon">🐾</div>
          <h3>Tu primera ficha empieza aca</h3>
          <p>Registra a tu mascota y empieza a centralizar vacunas, consultas y notas de salud.</p>
          <Link to={`${PETBOOK_BASE_PATH}/mascotas/nueva`}>
            <Button>Agregar primera mascota</Button>
          </Link>
        </section>
      ) : (
        <>
          <div className="petbook-grid">
            {mascotas.map((mascota) => (
              <MascotaCard key={mascota.id} mascota={mascota} />
            ))}
          </div>
          <Link className="petbook-fab" to={`${PETBOOK_BASE_PATH}/mascotas/nueva`} aria-label="Agregar mascota">
            +
          </Link>
        </>
      )}
    </section>
  )
}

export default MisMascotas
