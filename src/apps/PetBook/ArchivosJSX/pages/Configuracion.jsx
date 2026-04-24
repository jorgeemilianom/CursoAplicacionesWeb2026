import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import ProBadge from '../components/ui/ProBadge'
import Button from '../components/ui/Button'
import { useUser } from '../../ArchivosJS/hooks/useUser'
import { STORAGE_KEYS } from '../../ArchivosJS/utils/constants'

function Configuracion() {
  const { user } = useUser()
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.emailNotifications)
    return saved ? saved === 'true' : false
  })

  const [anticipacionAlertas, setAnticipacionAlertas] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.anticipacionAlertas)
    return saved ? parseInt(saved) : 7
  })

  const [horaNotificaciones, setHoraNotificaciones] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.horaNotificaciones)
    return saved || '09:00'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.emailNotifications, String(emailNotifications))
  }, [emailNotifications])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.anticipacionAlertas, String(anticipacionAlertas))
  }, [anticipacionAlertas])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.horaNotificaciones, horaNotificaciones)
  }, [horaNotificaciones])

  return (
    <section className="petbook-page">
      {/* 👤 Mi perfil */}
      <Card title="👤 Mi perfil" subtitle="Información personal">
        <div className="petbook-definition-list">
          <span>Nombre</span>
          <strong>{user?.nombre || 'Sin dato'}</strong>
          <span>Email</span>
          <strong>{user?.email || 'Sin dato'}</strong>
          <span>Teléfono</span>
          <strong>{user?.telefono || 'Sin dato'}</strong>
          <span>Ubicación</span>
          <strong>{user?.ubicacion || 'Sin dato'}</strong>
        </div>
        <Button variant="secondary">Editar perfil</Button>
      </Card>

      {/* 🔔 Notificaciones */}
      <Card title="🔔 Notificaciones" subtitle="Preferencias de recordatorios">
        <div className="petbook-stack">
          <label className="petbook-toggle">
            <span>📧 Email (EmailJS)</span>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(event) => setEmailNotifications(event.target.checked)}
            />
          </label>
          <p className="petbook-text-small">
            Recordatorios por correo electrónico
          </p>

          <label className="petbook-toggle">
            <span>📱 WhatsApp <ProBadge /></span>
            <input type="checkbox" disabled />
          </label>
          <p className="petbook-text-small">
            Recibí alertas directo en WhatsApp<br />
            ✨ Disponible en el plan PetBook Pro
          </p>

          <label className="petbook-toggle">
            <span>💬 SMS <ProBadge /></span>
            <input type="checkbox" disabled />
          </label>
          <p className="petbook-text-small">
            Mensajes de texto a tu celular<br />
            ✨ Disponible en el plan PetBook Pro
          </p>

          <Button variant="primary">Conocer plan Pro →</Button>
        </div>
      </Card>

      {/* 📅 Preferencias */}
      <Card title="📅 Preferencias" subtitle="Personalización de la app">
        <div className="petbook-stack">
          <label>
            <span>Anticipación de alertas</span>
            <select
              value={anticipacionAlertas}
              onChange={(e) => setAnticipacionAlertas(parseInt(e.target.value))}
            >
              <option value={7}>7 días antes</option>
              <option value={15}>15 días antes</option>
              <option value={30}>30 días antes</option>
            </select>
          </label>

          <label>
            <span>Hora de las notificaciones</span>
            <input
              type="time"
              value={horaNotificaciones}
              onChange={(e) => setHoraNotificaciones(e.target.value)}
            />
          </label>

          <label>
            <span>Idioma</span>
            <select defaultValue="es">
              <option value="es">Español</option>
              <option value="en" disabled>Inglés (próximamente)</option>
            </select>
          </label>
        </div>
      </Card>

      {/* 🔗 Integraciones */}
      <Card title="🔗 Integraciones" subtitle="Conexiones con servicios externos">
        <div className="petbook-stack">
          <div className="petbook-integration-status">
            <span>🌤️ OpenWeatherMap</span>
            <span className="petbook-status petbook-status--connected">Conectada</span>
          </div>

          <div className="petbook-integration-status">
            <span>📧 EmailJS</span>
            <span className="petbook-status petbook-status--connected">Conectada</span>
          </div>

          <div className="petbook-integration-status">
            <span>🗺️ OpenStreetMap</span>
            <span className="petbook-status petbook-status--connected">Conectada</span>
          </div>

          <div className="petbook-integration-status">
            <span>🤖 Anthropic Claude</span>
            <span className="petbook-status petbook-status--connected">Conectada</span>
          </div>

          <div className="petbook-integration-status">
            <span>📅 Google Calendar <ProBadge /></span>
            <span className="petbook-status petbook-status--pending">Pendiente</span>
          </div>

          <div className="petbook-integration-status">
            <span>🗺️ Google Maps <ProBadge /></span>
            <span className="petbook-status petbook-status--pending">Pendiente</span>
          </div>

          <div className="petbook-integration-status">
            <span>📱 Twilio (WhatsApp/SMS) <ProBadge /></span>
            <span className="petbook-status petbook-status--pending">Pendiente</span>
          </div>
        </div>
      </Card>

      {/* 💎 Plan PetBook */}
      <Card title="💎 Plan PetBook" subtitle="Tu plan actual">
        <div className="petbook-stack">
          <div className="petbook-plan-info">
            <span>Plan actual:</span>
            <strong>Gratuito</strong>
          </div>

          <div className="petbook-plan-features">
            <h4>Funciones incluidas:</h4>
            <ul>
              <li>✅ Hasta 5 mascotas</li>
              <li>✅ Historial completo de salud</li>
              <li>✅ Calendario inteligente</li>
              <li>✅ Alertas por email</li>
              <li>✅ Clima inteligente</li>
              <li>✅ Veterinarias cercanas (OpenStreetMap)</li>
              <li>✅ Asistente IA básico</li>
            </ul>
          </div>

          <div className="petbook-plan-pro">
            <h4>Plan Pro incluye:</h4>
            <ul>
              <li>💎 Mascotas ilimitadas</li>
              <li>💎 WhatsApp y SMS</li>
              <li>💎 Google Maps + Street View</li>
              <li>💎 Sincronización con Google Calendar</li>
              <li>💎 Asistente IA avanzado (Claude Opus)</li>
              <li>💎 Soporte prioritario</li>
            </ul>
          </div>

          <Button variant="primary">Conocer plan Pro →</Button>
        </div>
      </Card>

      {/* 🔐 Seguridad */}
      <Card title="🔐 Seguridad" subtitle="Configuración de cuenta">
        <div className="petbook-stack">
          <Button variant="secondary">Cambiar contraseña</Button>
          <Button variant="outline">Cerrar sesión en todos los dispositivos</Button>
        </div>
      </Card>
    </section>
  )
}

export default Configuracion
