import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useRazas } from '../../ArchivosJS/hooks/useRazas'
import { ESPECIES, SEXOS, PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

const initialForm = {
  nombre: '',
  especie: 'perro',
  raza: '',
  sexo: 'macho',
  fechaNacimiento: '',
  color: '',
  peso: '',
  foto: '',
  veterinario: '',
  telefonoVet: '',
  contactoEmergencia: '',
  microchip: '',
  esterilizado: false,
}

function NuevaMascota() {
  const navigate = useNavigate()
  const { agregarMascota } = useMascota()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { razas, loading: loadingRazas, error: razasError } = useRazas(form.especie)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      handleChange('foto', String(reader.result || ''))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      setSaving(true)
      const creada = await agregarMascota({
        ...form,
        peso: Number(form.peso) || 0,
      })
      navigate(`${PETBOOK_BASE_PATH}/mascotas/${creada.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="petbook-page">
      <Card title="Nueva mascota" subtitle="Formulario completo de alta conectado al JSON Server.">
        <form className="petbook-form petbook-form--two-columns" onSubmit={handleSubmit}>
          <label>
            Nombre *
            <input value={form.nombre} onChange={(event) => handleChange('nombre', event.target.value)} required />
          </label>
          <label>
            Especie *
            <select
              value={form.especie}
              onChange={(event) => {
                handleChange('especie', event.target.value)
                handleChange('raza', '')
              }}
            >
              {ESPECIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Raza
            <select value={form.raza} onChange={(event) => handleChange('raza', event.target.value)} required>
              <option value="">{loadingRazas ? 'Cargando razas...' : 'Selecciona una raza'}</option>
              {razas.map((raza) => (
                <option key={raza} value={raza}>
                  {raza}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sexo *
            <select value={form.sexo} onChange={(event) => handleChange('sexo', event.target.value)}>
              {SEXOS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fecha de nacimiento *
            <input type="date" value={form.fechaNacimiento} onChange={(event) => handleChange('fechaNacimiento', event.target.value)} required />
          </label>
          <label>
            Color / pelaje
            <input value={form.color} onChange={(event) => handleChange('color', event.target.value)} />
          </label>
          <label>
            Peso (kg)
            <input value={form.peso} onChange={(event) => handleChange('peso', event.target.value)} />
          </label>
          <label>
            Veterinario de cabecera
            <input value={form.veterinario} onChange={(event) => handleChange('veterinario', event.target.value)} />
          </label>
          <label>
            Telefono del veterinario
            <input value={form.telefonoVet} onChange={(event) => handleChange('telefonoVet', event.target.value)} />
          </label>
          <label>
            Contacto de emergencia
            <input value={form.contactoEmergencia} onChange={(event) => handleChange('contactoEmergencia', event.target.value)} />
          </label>
          <label>
            Numero de microchip
            <input value={form.microchip} onChange={(event) => handleChange('microchip', event.target.value)} />
          </label>
          <label className="petbook-toggle">
            <span>Esterilizado / castrado</span>
            <input type="checkbox" checked={form.esterilizado} onChange={(event) => handleChange('esterilizado', event.target.checked)} />
          </label>
          <label>
            Foto
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <div className="petbook-photo-preview">
            {form.foto ? <img src={form.foto} alt="Preview de mascota" /> : <span>Sin foto. Se asignara avatar por especie.</span>}
          </div>
          {razasError && <Alert tone="info">{razasError}</Alert>}
          {error && <Alert tone="danger">{error}</Alert>}
          <div className="petbook-form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar mascota'}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}

export default NuevaMascota
