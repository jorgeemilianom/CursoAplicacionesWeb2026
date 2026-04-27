import { Link } from 'react-router-dom'
import AlertaBanner from '../components/shared/AlertaBanner'
import MascotaCard from '../components/shared/MascotaCard'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAlertas } from '../../ArchivosJS/hooks/useAlertas'
import { useCalendarioEventos } from '../../ArchivosJS/hooks/useCalendarioEventos'
import { useClima } from '../../ArchivosJS/hooks/useClima'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useUser } from '../../ArchivosJS/hooks/useUser'
import { EVENT_TYPE_META, PETBOOK_BASE_PATH, PETBOOK_TIPS } from '../../ArchivosJS/utils/constants'
import { formatearFechaCorta } from '../../ArchivosJS/utils/fechas'

function Dashboard() {
  const { user } = useUser()
  const { clima, consejoMascota } = useClima(user?.ubicacion?.split(',')[0] || 'Posadas')
  const { mascotas } = useMascota()
  const { alertasNoLeidas, descartarAlerta, marcarLeida } = useAlertas()
  const { proximosEventos } = useCalendarioEventos()

  const saludo = user?.nombre ? `Buen dia, ${user.nombre.split(' ')[0]}!` : 'Buen dia!'
  const tipDelDia = PETBOOK_TIPS[new Date().getDate() % PETBOOK_TIPS.length]
  const alertaPrincipal = alertasNoLeidas[0] || null

  return (
    <section className="petbook-page">
      <header className="petbook-page-header">
        <div>
          <p className="petbook-kicker">Dashboard</p>
          <h2>{saludo}</h2>
          <p>{clima?.ok ? clima.resumen : clima?.message || 'Clima pendiente de configurar.'}</p>
        </div>
        <div className="petbook-inline petbook-inline--stretch">
          <Badge tone="neutral">{mascotas.length} mascotas</Badge>
          <Badge tone="info">{proximosEventos.length} eventos en 7 dias</Badge>
        </div>
      </header>

      {alertaPrincipal && (
        <AlertaBanner alerta={alertaPrincipal} onRead={marcarLeida} onDismiss={descartarAlerta} />
      )}

      <div className="petbook-grid petbook-grid--dashboard">
        <Card
          title="Mis mascotas"
          subtitle="Acceso rapido a tus fichas"
          actions={
            <Link to={`${PETBOOK_BASE_PATH}/mascotas`}>
              <Button variant="secondary">Ver todas</Button>
            </Link>
          }
        >
          {mascotas.length === 0 ? (
            <p>Todavia no registraste mascotas en PetBook.</p>
          ) : (
            <div className="petbook-horizontal-list">
              {mascotas.map((mascota) => (
                <div key={mascota.id} className="petbook-horizontal-list__item">
                  <MascotaCard mascota={mascota} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Clima pet friendly" subtitle={clima?.ciudad || 'Widget de clima'}>
          {clima?.ok ? (
            <div className="petbook-stack">
              <strong>{clima.temperatura}°C</strong>
              <span>{clima.condicion} - Humedad {clima.humedad}%</span>
              {consejoMascota && (
                <div className={`petbook-weather-tip petbook-weather-tip--${consejoMascota.alerta}`}>
                  <strong>{consejoMascota.icono}</strong>
                  <p>{consejoMascota.mensaje}</p>
                </div>
              )}
            </div>
          ) : (
            <p>{clima?.message || 'Configura OpenWeather para habilitar este widget.'}</p>
          )}
        </Card>

        <Card title="Proximos eventos" subtitle="Agenda de los siguientes 7 dias">
          {proximosEventos.length === 0 ? (
            <p>No hay eventos cercanos. Buen momento para cargar nuevos recordatorios.</p>
          ) : (
            <div className="petbook-event-list">
              {proximosEventos.map((evento) => (
                <article key={evento.id} className={`petbook-event-list__item petbook-event-list__item--${evento.tipo}`}>
                  <span className={`petbook-event-dot petbook-event-dot--${evento.tipo}`}>{EVENT_TYPE_META[evento.tipo]?.icon || 'E'}</span>
                  <div className="petbook-stack">
                    <strong>{evento.titulo}</strong>
                    <span>
                      {evento.mascotaNombre} - {formatearFechaCorta(evento.fecha)}
                    </span>
                    <span>{evento.descripcion}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card title="Accesos rapidos" subtitle="Atajos para el dia a dia">
          <div className="petbook-quick-actions">
            <Link className="petbook-quick-actions__link" to={`${PETBOOK_BASE_PATH}/mascotas/nueva`}>
              Nueva mascota
            </Link>
            <Link className="petbook-quick-actions__link" to={`${PETBOOK_BASE_PATH}/calendario`}>
              Ver calendario
            </Link>
            <Link className="petbook-quick-actions__link" to={`${PETBOOK_BASE_PATH}/veterinarias`}>
              Veterinarias cercanas
            </Link>
            <Link className="petbook-quick-actions__link" to={`${PETBOOK_BASE_PATH}/mascotas`}>
              Agregar vacuna
            </Link>
          </div>
        </Card>

        <Card title="Tip del dia" subtitle="Pequenas acciones, gran diferencia">
          <p>{tipDelDia}</p>
        </Card>
      </div>
    </section>
  )
}

export default Dashboard
