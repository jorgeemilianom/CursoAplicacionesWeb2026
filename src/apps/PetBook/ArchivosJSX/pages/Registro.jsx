import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useUser } from '../../ArchivosJS/hooks/useUser'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

const initialForm = {
  nombre: '',
  email: '',
  password: '',
  telefono: '',
  ubicacion: '',
  foto: '',
}

function Registro() {
  const navigate = useNavigate()
  const { registrarUsuario, error, loading, clearUserError } = useUser()
  const [form, setForm] = useState(initialForm)

  async function handleSubmit(event) {
    event.preventDefault()
    clearUserError()

    try {
      await registrarUsuario(form)
      navigate(`${PETBOOK_BASE_PATH}/mascotas`, { replace: true })
    } catch (error) {
      void error
    }
  }

  return (
    <section className="petbook-auth">
      <Card title="Crear cuenta" subtitle="Registro basico conectado al JSON Server.">
        <form className="petbook-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input value={form.nombre} onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
          </label>
          <label>
            Telefono
            <input value={form.telefono} onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))} />
          </label>
          <label>
            Ubicacion
            <input value={form.ubicacion} onChange={(event) => setForm((prev) => ({ ...prev, ubicacion: event.target.value }))} />
          </label>
          {error && <Alert tone="danger">{error}</Alert>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear usuario'}
          </Button>
        </form>
      </Card>
    </section>
  )
}

export default Registro
