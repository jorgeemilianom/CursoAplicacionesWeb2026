import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import Alert from '../components/ui/Alert'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import ProgressBar from '../components/ui/ProgressBar'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useVacunas } from '../../ArchivosJS/hooks/useVacunas'
import { calcularEdad, formatearFechaCorta, formatearFechaLarga } from '../../ArchivosJS/utils/fechas'
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'

const tabs = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'vacunas', label: 'Vacunas' },
  { id: 'desparasitaciones', label: 'Desparasitaciones' },
  { id: 'consultas', label: 'Consultas' },
  { id: 'diario', label: 'Diario de Salud' },
]

const vaccineFormInitial = {
  nombre: '',
  fecha: '',
  proxima: '',
  veterinario: '',
  lote: '',
  notas: '',
}

const desparasitacionFormInitial = {
  tipo: 'interna',
  producto: '',
  fecha: '',
  proxima: '',
  notas: '',
}

const consultaFormInitial = {
  fecha: '',
  motivo: '',
  diagnostico: '',
  tratamiento: '',
  peso: '',
  veterinario: '',
  costo: '',
  notas: '',
}

const notaFormInitial = {
  fecha: '',
  texto: '',
  foto: '',
}

function getStatusMeta(estado) {
  if (estado === 'vencido') return { tipo: 'danger', texto: 'Vencido', progress: 20, color: '#b0493c' }
  if (estado === 'atencion') return { tipo: 'warning', texto: 'Atencion requerida', progress: 62, color: '#d2a142' }
  return { tipo: 'success', texto: 'Al dia', progress: 100, color: '#2f7d52' }
}

function formatPhoneHref(phone) {
  return `tel:${String(phone || '').replace(/\s+/g, '')}`
}

function FichaMascota() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    mascota,
    loading,
    error,
    edadCalculada,
    consultas,
    notasSalud,
    pesoHistorial,
    actualizarMascota,
    eliminarMascota,
    agregarConsulta,
    editarConsulta,
    eliminarConsulta,
    agregarNota,
    eliminarNota,
  } = useMascota(id)
  const {
    vacunas,
    desparasitaciones,
    estadoGeneral,
    agregarVacuna,
    editarVacuna,
    eliminarVacuna,
    agregarDesparasitacion,
    editarDesparasitacion,
    eliminarDesparasitacion,
  } = useVacunas(id)
  const [activeTab, setActiveTab] = useState('perfil')
  const [editingProfile, setEditingProfile] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showVacunaModal, setShowVacunaModal] = useState(false)
  const [showDesparasitacionModal, setShowDesparasitacionModal] = useState(false)
  const [showConsultaModal, setShowConsultaModal] = useState(false)
  const [showNotaModal, setShowNotaModal] = useState(false)
  const [editingVacunaId, setEditingVacunaId] = useState(null)
  const [editingDesparasitacionId, setEditingDesparasitacionId] = useState(null)
  const [editingConsultaId, setEditingConsultaId] = useState(null)
  const [formError, setFormError] = useState('')
  const [profileForm, setProfileForm] = useState(null)
  const [vacunaForm, setVacunaForm] = useState(vaccineFormInitial)
  const [desparasitacionForm, setDesparasitacionForm] = useState(desparasitacionFormInitial)
  const [consultaForm, setConsultaForm] = useState(consultaFormInitial)
  const [notaForm, setNotaForm] = useState(notaFormInitial)

  const statusMeta = useMemo(() => getStatusMeta(estadoGeneral), [estadoGeneral])

  function updateProfileField(field, value) {
    setProfileForm((prev) => ({ ...(prev || mascota), [field]: value }))
  }

  function handleNoteFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setNotaForm((prev) => ({ ...prev, foto: String(reader.result || '') }))
    }
    reader.readAsDataURL(file)
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()

    try {
      const updated = await actualizarMascota(mascota.id, {
        ...mascota,
        ...profileForm,
        peso: Number(profileForm?.peso || 0),
      })
      setProfileForm(updated)
      setEditingProfile(false)
      setFormError('')
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDeletePet() {
    await eliminarMascota(mascota.id)
    navigate(`${PETBOOK_BASE_PATH}/mascotas`, { replace: true })
  }

  async function handleCreateVacuna(event) {
    event.preventDefault()
    if (editingVacunaId) {
      await editarVacuna(editingVacunaId, {
        ...vacunaForm,
        mascotaId: Number(id),
      })
    } else {
      await agregarVacuna(vacunaForm)
    }
    setVacunaForm(vaccineFormInitial)
    setEditingVacunaId(null)
    setShowVacunaModal(false)
  }

  async function handleCreateDesparasitacion(event) {
    event.preventDefault()
    if (editingDesparasitacionId) {
      await editarDesparasitacion(editingDesparasitacionId, {
        ...desparasitacionForm,
        mascotaId: Number(id),
      })
    } else {
      await agregarDesparasitacion(desparasitacionForm)
    }
    setDesparasitacionForm(desparasitacionFormInitial)
    setEditingDesparasitacionId(null)
    setShowDesparasitacionModal(false)
  }

  async function handleCreateConsulta(event) {
    event.preventDefault()
    const payload = {
      ...consultaForm,
      mascotaId: Number(id),
      peso: Number(consultaForm.peso || 0),
      costo: Number(consultaForm.costo || 0),
    }

    if (editingConsultaId) {
      await editarConsulta(editingConsultaId, payload)
    } else {
      await agregarConsulta(payload)
    }
    setConsultaForm(consultaFormInitial)
    setEditingConsultaId(null)
    setShowConsultaModal(false)
  }

  async function handleCreateNota(event) {
    event.preventDefault()
    await agregarNota(notaForm)
    setNotaForm(notaFormInitial)
    setShowNotaModal(false)
  }

  if (loading) {
    return <Loader label="Cargando ficha..." />
  }

  if (!mascota) {
    return (
      <section className="petbook-page">
        <Card title="Mascota no encontrada">
          <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/mascotas`}>
            Volver al listado
          </Link>
        </Card>
      </section>
    )
  }

  return (
    <>
      <section className="petbook-page">
        <header className="petbook-page-header">
          <div>
            <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/mascotas`}>
              ← Volver a mis mascotas
            </Link>
            <h2>{mascota.nombre}</h2>
            <p>{mascota.raza} • {edadCalculada || calcularEdad(mascota.fechaNacimiento)}</p>
          </div>
          <div className="petbook-inline petbook-inline--stretch">
            <Badge tipo={statusMeta.tipo} texto={statusMeta.texto} />
            <ProgressBar valor={statusMeta.progress} color={statusMeta.color} etiqueta={statusMeta.texto} />
          </div>
        </header>

        {error && <Alert tone="danger">{error}</Alert>}
        {formError && <Alert tone="danger">{formError}</Alert>}

        <div className="petbook-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`petbook-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'perfil' && (
          <Card title="Perfil general" subtitle="Datos base y seguimiento clinico">
            <div className="petbook-profile">
              <div className="petbook-profile__media">
                {mascota.foto ? <img src={mascota.foto} alt={mascota.nombre} /> : <div className="petbook-profile__fallback">🐾</div>}
              </div>
              <div className="petbook-profile__info">
                <div className="petbook-definition-list">
                  <span>Nombre</span>
                  <strong>{mascota.nombre}</strong>
                  <span>Edad</span>
                  <strong>{edadCalculada}</strong>
                  <span>Especie</span>
                  <strong>{mascota.especie}</strong>
                  <span>Raza</span>
                  <strong>{mascota.raza}</strong>
                  <span>Peso</span>
                  <strong>{mascota.peso} kg</strong>
                  <span>Veterinario</span>
                  <strong>{mascota.veterinario || 'Sin dato'}</strong>
                  <span>Telefono vet</span>
                  <strong>{mascota.telefonoVet || 'Sin dato'}</strong>
                  <span>Microchip</span>
                  <strong>{mascota.microchip || 'Sin dato'}</strong>
                  <span>Esterilizado</span>
                  <strong>{mascota.esterilizado ? 'Si' : 'No'}</strong>
                </div>
                <div className="petbook-inline">
                  {mascota.telefonoVet && (
                    <a className="petbook-link" href={formatPhoneHref(mascota.telefonoVet)}>
                      Llamar al veterinario
                    </a>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setProfileForm(mascota)
                      setEditingProfile(true)
                    }}
                  >
                    Editar datos
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
                    Eliminar mascota
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'vacunas' && (
          <Card
            title="Historial de vacunas"
            subtitle="Seguimiento completo del calendario de vacunacion"
            actions={<Button onClick={() => setShowVacunaModal(true)}>Agregar vacuna</Button>}
          >
            <div className="petbook-table">
              <div className="petbook-table__head">
                <span>Vacuna</span>
                <span>Fecha</span>
                <span>Proxima</span>
                <span>Estado</span>
                <span>Veterinario</span>
                <span>Acciones</span>
              </div>
              {vacunas.map((vacuna) => (
                <div key={vacuna.id} className="petbook-table__row">
                  <span>{vacuna.nombre}</span>
                  <span>{formatearFechaCorta(vacuna.fecha)}</span>
                  <span>{formatearFechaCorta(vacuna.proxima)}</span>
                  <span>
                    <Badge
                      tipo={vacuna.vencida ? 'danger' : vacuna.diasRestantes <= 30 ? 'warning' : 'success'}
                      texto={vacuna.vencida ? 'Vencida' : vacuna.diasRestantes <= 30 ? 'Atencion' : 'Al dia'}
                    />
                  </span>
                  <span>{vacuna.veterinario || 'Sin dato'}</span>
                  <span className="petbook-inline">
                    <button
                      className="petbook-icon-button"
                      type="button"
                      onClick={() => {
                        setVacunaForm({
                          nombre: vacuna.nombre,
                          fecha: vacuna.fecha,
                          proxima: vacuna.proxima,
                          veterinario: vacuna.veterinario || '',
                          lote: vacuna.lote || '',
                          notas: vacuna.notas || '',
                        })
                        setEditingVacunaId(vacuna.id)
                        setShowVacunaModal(true)
                      }}
                    >
                      Editar
                    </button>
                    <button className="petbook-icon-button" type="button" onClick={() => eliminarVacuna(vacuna.id)}>
                      Eliminar
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'desparasitaciones' && (
          <Card
            title="Desparasitaciones"
            subtitle="Registro de antiparasitarios internos y externos"
            actions={<Button onClick={() => setShowDesparasitacionModal(true)}>Agregar desparasitacion</Button>}
          >
            <div className="petbook-table">
              <div className="petbook-table__head">
                <span>Tipo</span>
                <span>Producto</span>
                <span>Fecha</span>
                <span>Proxima</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>
              {desparasitaciones.map((item) => (
                <div key={item.id} className="petbook-table__row">
                  <span>{item.tipo}</span>
                  <span>{item.producto}</span>
                  <span>{formatearFechaCorta(item.fecha)}</span>
                  <span>{formatearFechaCorta(item.proxima)}</span>
                  <span>
                    <Badge
                      tipo={item.vencida ? 'danger' : item.diasRestantes <= 30 ? 'warning' : 'success'}
                      texto={item.vencida ? 'Vencida' : item.diasRestantes <= 30 ? 'Atencion' : 'Al dia'}
                    />
                  </span>
                  <span className="petbook-inline">
                    <button
                      className="petbook-icon-button"
                      type="button"
                      onClick={() => {
                        setDesparasitacionForm({
                          tipo: item.tipo,
                          producto: item.producto,
                          fecha: item.fecha,
                          proxima: item.proxima,
                          notas: item.notas || '',
                        })
                        setEditingDesparasitacionId(item.id)
                        setShowDesparasitacionModal(true)
                      }}
                    >
                      Editar
                    </button>
                    <button className="petbook-icon-button" type="button" onClick={() => eliminarDesparasitacion(item.id)}>
                      Eliminar
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'consultas' && (
          <Card
            title="Consultas veterinarias"
            subtitle="Linea de tiempo clinica"
            actions={<Button onClick={() => setShowConsultaModal(true)}>Nueva consulta</Button>}
          >
            <div className="petbook-timeline">
              {consultas.map((consulta) => (
                <article key={consulta.id} className="petbook-timeline__item">
                  <div>
                    <strong>{formatearFechaLarga(consulta.fecha)}</strong>
                    <p>{consulta.motivo}</p>
                    <p>Diagnostico: {consulta.diagnostico || 'Sin dato'}</p>
                    <p>Tratamiento: {consulta.tratamiento || 'Sin dato'}</p>
                    <p>Peso: {consulta.peso || 'Sin dato'} kg</p>
                    <p>Veterinario: {consulta.veterinario || 'Sin dato'}</p>
                  </div>
                  <div className="petbook-inline">
                    <button
                      className="petbook-icon-button"
                      type="button"
                      onClick={() => {
                        setConsultaForm({
                          fecha: consulta.fecha,
                          motivo: consulta.motivo,
                          diagnostico: consulta.diagnostico || '',
                          tratamiento: consulta.tratamiento || '',
                          peso: consulta.peso || '',
                          veterinario: consulta.veterinario || '',
                          costo: consulta.costo || '',
                          notas: consulta.notas || '',
                        })
                        setEditingConsultaId(consulta.id)
                        setShowConsultaModal(true)
                      }}
                    >
                      Editar
                    </button>
                    <button className="petbook-icon-button" type="button" onClick={() => eliminarConsulta(consulta.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'diario' && (
          <Card
            title="Diario de salud"
            subtitle="Peso historico y notas libres"
            actions={<Button onClick={() => setShowNotaModal(true)}>Nueva nota</Button>}
          >
            <div className="petbook-chart">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={pesoHistorial}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7d6c3" />
                  <XAxis dataKey="fecha" stroke="#705a45" />
                  <YAxis stroke="#705a45" />
                  <Tooltip />
                  <Area type="monotone" dataKey="peso" stroke="#c96b3b" fill="#f3c79f" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="petbook-stack">
              {notasSalud.map((nota) => (
                <article key={nota.id} className="petbook-note">
                  <div>
                    <strong>{formatearFechaLarga(nota.fecha)}</strong>
                    <p>{nota.texto}</p>
                    {nota.foto && <img src={nota.foto} alt="Nota de salud" className="petbook-note__image" />}
                  </div>
                  <button className="petbook-icon-button" type="button" onClick={() => eliminarNota(nota.id)}>
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          </Card>
        )}
      </section>

      <Modal isOpen={editingProfile} onClose={() => setEditingProfile(false)} title="Editar datos de la mascota">
        <form className="petbook-form" onSubmit={handleProfileSubmit}>
          <label>
            Nombre
            <input value={profileForm?.nombre || ''} onChange={(event) => updateProfileField('nombre', event.target.value)} />
          </label>
          <label>
            Raza
            <input value={profileForm?.raza || ''} onChange={(event) => updateProfileField('raza', event.target.value)} />
          </label>
          <label>
            Peso
            <input value={profileForm?.peso || ''} onChange={(event) => updateProfileField('peso', event.target.value)} />
          </label>
          <label>
            Veterinario
            <input value={profileForm?.veterinario || ''} onChange={(event) => updateProfileField('veterinario', event.target.value)} />
          </label>
          <label>
            Telefono vet
            <input value={profileForm?.telefonoVet || ''} onChange={(event) => updateProfileField('telefonoVet', event.target.value)} />
          </label>
          <Button type="submit">Guardar cambios</Button>
        </form>
      </Modal>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Eliminar mascota">
        <div className="petbook-stack">
          <p>Esta accion elimina la mascota del panel principal. Los registros clinicos ya guardados pueden quedar historicos.</p>
          <div className="petbook-inline">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDeletePet}>Confirmar eliminacion</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showVacunaModal}
        onClose={() => {
          setShowVacunaModal(false)
          setEditingVacunaId(null)
          setVacunaForm(vaccineFormInitial)
        }}
        title={editingVacunaId ? 'Editar vacuna' : 'Agregar vacuna'}
      >
        <form className="petbook-form" onSubmit={handleCreateVacuna}>
          <label>
            Nombre de la vacuna *
            <input value={vacunaForm.nombre} onChange={(event) => setVacunaForm((prev) => ({ ...prev, nombre: event.target.value }))} required />
          </label>
          <label>
            Fecha de aplicacion *
            <input type="date" value={vacunaForm.fecha} onChange={(event) => setVacunaForm((prev) => ({ ...prev, fecha: event.target.value }))} required />
          </label>
          <label>
            Fecha de proxima dosis *
            <input type="date" value={vacunaForm.proxima} onChange={(event) => setVacunaForm((prev) => ({ ...prev, proxima: event.target.value }))} required />
          </label>
          <label>
            Veterinario
            <input value={vacunaForm.veterinario} onChange={(event) => setVacunaForm((prev) => ({ ...prev, veterinario: event.target.value }))} />
          </label>
          <label>
            Lote
            <input value={vacunaForm.lote} onChange={(event) => setVacunaForm((prev) => ({ ...prev, lote: event.target.value }))} />
          </label>
          <label>
            Notas
            <textarea value={vacunaForm.notas} onChange={(event) => setVacunaForm((prev) => ({ ...prev, notas: event.target.value }))} />
          </label>
          <Button type="submit">{editingVacunaId ? 'Guardar cambios' : 'Guardar vacuna'}</Button>
        </form>
      </Modal>

      <Modal
        isOpen={showDesparasitacionModal}
        onClose={() => {
          setShowDesparasitacionModal(false)
          setEditingDesparasitacionId(null)
          setDesparasitacionForm(desparasitacionFormInitial)
        }}
        title={editingDesparasitacionId ? 'Editar desparasitacion' : 'Agregar desparasitacion'}
      >
        <form className="petbook-form" onSubmit={handleCreateDesparasitacion}>
          <label>
            Tipo
            <select value={desparasitacionForm.tipo} onChange={(event) => setDesparasitacionForm((prev) => ({ ...prev, tipo: event.target.value }))}>
              <option value="interna">Interna</option>
              <option value="externa">Externa</option>
              <option value="ambas">Ambas</option>
            </select>
          </label>
          <label>
            Producto utilizado
            <input value={desparasitacionForm.producto} onChange={(event) => setDesparasitacionForm((prev) => ({ ...prev, producto: event.target.value }))} required />
          </label>
          <label>
            Fecha
            <input type="date" value={desparasitacionForm.fecha} onChange={(event) => setDesparasitacionForm((prev) => ({ ...prev, fecha: event.target.value }))} required />
          </label>
          <label>
            Proxima dosis
            <input type="date" value={desparasitacionForm.proxima} onChange={(event) => setDesparasitacionForm((prev) => ({ ...prev, proxima: event.target.value }))} required />
          </label>
          <label>
            Notas
            <textarea value={desparasitacionForm.notas} onChange={(event) => setDesparasitacionForm((prev) => ({ ...prev, notas: event.target.value }))} />
          </label>
          <Button type="submit">{editingDesparasitacionId ? 'Guardar cambios' : 'Guardar desparasitacion'}</Button>
        </form>
      </Modal>

      <Modal
        isOpen={showConsultaModal}
        onClose={() => {
          setShowConsultaModal(false)
          setEditingConsultaId(null)
          setConsultaForm(consultaFormInitial)
        }}
        title={editingConsultaId ? 'Editar consulta veterinaria' : 'Nueva consulta veterinaria'}
      >
        <form className="petbook-form" onSubmit={handleCreateConsulta}>
          <label>
            Fecha *
            <input type="date" value={consultaForm.fecha} onChange={(event) => setConsultaForm((prev) => ({ ...prev, fecha: event.target.value }))} required />
          </label>
          <label>
            Motivo *
            <input value={consultaForm.motivo} onChange={(event) => setConsultaForm((prev) => ({ ...prev, motivo: event.target.value }))} required />
          </label>
          <label>
            Diagnostico
            <input value={consultaForm.diagnostico} onChange={(event) => setConsultaForm((prev) => ({ ...prev, diagnostico: event.target.value }))} />
          </label>
          <label>
            Tratamiento
            <input value={consultaForm.tratamiento} onChange={(event) => setConsultaForm((prev) => ({ ...prev, tratamiento: event.target.value }))} />
          </label>
          <label>
            Peso
            <input value={consultaForm.peso} onChange={(event) => setConsultaForm((prev) => ({ ...prev, peso: event.target.value }))} />
          </label>
          <label>
            Veterinario
            <input value={consultaForm.veterinario} onChange={(event) => setConsultaForm((prev) => ({ ...prev, veterinario: event.target.value }))} />
          </label>
          <label>
            Costo
            <input value={consultaForm.costo} onChange={(event) => setConsultaForm((prev) => ({ ...prev, costo: event.target.value }))} />
          </label>
          <label>
            Notas
            <textarea value={consultaForm.notas} onChange={(event) => setConsultaForm((prev) => ({ ...prev, notas: event.target.value }))} />
          </label>
          <Button type="submit">{editingConsultaId ? 'Guardar cambios' : 'Guardar consulta'}</Button>
        </form>
      </Modal>

      <Modal isOpen={showNotaModal} onClose={() => setShowNotaModal(false)} title="Nueva nota de salud">
        <form className="petbook-form" onSubmit={handleCreateNota}>
          <label>
            Fecha
            <input type="date" value={notaForm.fecha} onChange={(event) => setNotaForm((prev) => ({ ...prev, fecha: event.target.value }))} required />
          </label>
          <label>
            Nota
            <textarea value={notaForm.texto} onChange={(event) => setNotaForm((prev) => ({ ...prev, texto: event.target.value }))} required />
          </label>
          <label>
            Foto
            <input type="file" accept="image/*" onChange={handleNoteFile} />
          </label>
          <Button type="submit">Guardar nota</Button>
        </form>
      </Modal>
    </>
  )
}

export default FichaMascota
