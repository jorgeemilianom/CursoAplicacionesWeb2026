import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import { useUser } from '../../ArchivosJS/hooks/useUser'
import { STORAGE_KEYS } from '../../ArchivosJS/utils/constants'

function Configuracion() {
  const { user } = useUser()
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.emailNotifications)
    return saved ? saved === 'true' : false
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.emailNotifications, String(emailNotifications))
  }, [emailNotifications])

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

      <Card title="Notificaciones" subtitle="Preferencias de recordatorios">
        <label className="petbook-toggle">
          <span>Recibir emails automaticos de recordatorio</span>
          <input type="checkbox" checked={emailNotifications} onChange={(event) => setEmailNotifications(event.target.checked)} />
        </label>
        <p>
          Cuando esta opcion esta activa, PetBook queda preparado para enviar recordatorios por EmailJS en vacunas,
          eventos manuales y seguimiento de gestacion.
        </p>
      </Card>
    </section>
  )
}

export default Configuracion
