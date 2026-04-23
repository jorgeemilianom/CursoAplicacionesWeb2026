import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useUser } from '../../ArchivosJS/hooks/useUser'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error, loading, clearUserError } = useUser()
  const [form, setForm] = useState({
    email: 'maria@email.com',
    password: '1234',
  })

  async function handleSubmit(event) {
    event.preventDefault()
    clearUserError()

    try {
      await login(form.email, form.password)
      const target = location.state?.from?.pathname || `${PETBOOK_BASE_PATH}/mascotas`
      navigate(target, { replace: true })
    } catch (error) {
      void error
    }
  }

  return (
    <section className="petbook-auth">
      <Card title="Iniciar sesion" subtitle="Usa el usuario demo o registra uno nuevo.">
        <form className="petbook-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              type="email"
              required
            />
          </label>
          <label>
            Password
            <input
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              type="password"
              required
            />
          </label>
          {error && <Alert tone="danger">{error}</Alert>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Entrar a PetBook'}
          </Button>
        </form>
      </Card>
    </section>
  )
}

export default Login
