import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import ProgressBar from '../components/ui/ProgressBar'
import { useGestacion } from '../../ArchivosJS/hooks/useGestacion'
import { PETBOOK_BASE_PATH, SPECIES_AVATARS } from '../../ArchivosJS/utils/constants'
import { formatearFechaCorta, formatearFechaLarga } from '../../ArchivosJS/utils/fechas'

const initialGestacionForm = {
  fechaCruce: '',
  tipoCruce: 'natural',
  machoReproductor: '',
  cantidadCriasEsperadas: '',
  veterinarioSeguimiento: '',
  notas: '',
}

const initialPartoForm = {
  fechaPartoReal: '',
  horaParto: '',
  tipoParto: 'natural',
  cantidadCriasNacidas: 1,
  cantidadCriasVivas: 1,
  cantidadCriasSinVida: 0,
  pesoPromedioCrias: '',
  complicaciones: '',
  veterinarioPresente: '',
  notasGenerales: '',
  crias: [
    {
      nombre: '',
      sexo: 'no determinado',
      pesoNacimiento: '',
      color: '',
      estado: 'vivo',
      observaciones: '',
    },
  ],
}

function Gestacion() {
  const { mascotaId } = useParams()
  const {
    mascota,
    gestacion,
    crias,
    tieneGestacion,
    esHembra,
    loading,
    error,
    semanaActual,
    diaActual,
    progreso,
    diasRestantes,
    hitoActual,
    timeline,
    hitosProximos,
    actualizarNotas,
    editarDatosGestacion,
    iniciarGestacion,
    registrarParto,
    cancelarGestacion,
    crearFichaCria,
    marcarCriaAdoptada,
    actualizarCria,
  } = useGestacion(mascotaId)

  const [showNuevaGestacion, setShowNuevaGestacion] = useState(false)
  const [showEditarGestacion, setShowEditarGestacion] = useState(false)
  const [showPartoModal, setShowPartoModal] = useState(false)
  const [showCancelarModal, setShowCancelarModal] = useState(false)
  const [editingCria, setEditingCria] = useState(null)
  const [formError, setFormError] = useState('')
  const [gestacionForm, setGestacionForm] = useState(initialGestacionForm)
  const [partoForm, setPartoForm] = useState(initialPartoForm)
  const [notas, setNotas] = useState('')
  const [motivoCancelacion, setMotivoCancelacion] = useState('')
  const [criaForm, setCriaForm] = useState(null)

  const alertaParto = useMemo(() => diasRestantes !== null && diasRestantes <= 7 && tieneGestacion, [diasRestantes, tieneGestacion])

  useEffect(() => {
    setNotas(gestacion?.notas || '')
  }, [gestacion?.notas])

  if (loading) {
    return <Loader label="Cargando modulo de gestacion..." />
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

  async function handleCrearGestacion(event) {
    event.preventDefault()
    setFormError('')

    try {
      const nueva = await iniciarGestacion(gestacionForm)
      setNotas(nueva.notas || '')
      setShowNuevaGestacion(false)
      setGestacionForm(initialGestacionForm)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleEditarGestacion(event) {
    event.preventDefault()
    setFormError('')

    try {
      await editarDatosGestacion(gestacionForm)
      setShowEditarGestacion(false)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleGuardarNotas() {
    await actualizarNotas(notas)
  }

  async function handleRegistrarParto(event) {
    event.preventDefault()
    setFormError('')

    try {
      await registrarParto(partoForm)
      setShowPartoModal(false)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleCancelarGestacion(event) {
    event.preventDefault()
    await cancelarGestacion(motivoCancelacion)
    setShowCancelarModal(false)
  }

  async function handleCrearFichaCria(criaId) {
    try {
      await crearFichaCria(criaId)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleActualizarCria(event) {
    event.preventDefault()
    if (!editingCria) return
    await actualizarCria(editingCria.id, criaForm)
    setEditingCria(null)
    setCriaForm(null)
  }

  function addCria() {
    setPartoForm((prev) => ({
      ...prev,
      crias: [
        ...prev.crias,
        {
          nombre: '',
          sexo: 'no determinado',
          pesoNacimiento: '',
          color: '',
          estado: 'vivo',
          observaciones: '',
        },
      ],
    }))
  }

  function updateCriaDraft(index, field, value) {
    setPartoForm((prev) => ({
      ...prev,
      crias: prev.crias.map((cria, currentIndex) => (currentIndex === index ? { ...cria, [field]: value } : cria)),
    }))
  }

  function openEditGestacion() {
    setGestacionForm({
      fechaCruce: gestacion?.fechaCruce || '',
      tipoCruce: gestacion?.tipoCruce || 'natural',
      machoReproductor: gestacion?.machoReproductor || '',
      cantidadCriasEsperadas: gestacion?.cantidadCriasEsperadas || '',
      veterinarioSeguimiento: gestacion?.veterinarioSeguimiento || '',
      notas: gestacion?.notas || '',
    })
    setShowEditarGestacion(true)
  }

  if (!esHembra) {
    return (
      <section className="petbook-page">
        <Alert tone="danger">
          El modulo de gestacion solo esta disponible para mascotas registradas como hembras.
        </Alert>
        <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/mascotas/${mascota.id}`}>
          Volver a la ficha
        </Link>
      </section>
    )
  }

  if (!gestacion) {
    return (
      <>
        <section className="petbook-page">
          <div className="petbook-empty-state">
            <div className="petbook-empty-state__icon">{SPECIES_AVATARS[mascota.especie] || 'M'}</div>
            <h3>{mascota.nombre} no tiene una gestacion registrada</h3>
            <p>Registra una nueva gestacion para empezar el seguimiento completo desde el cruce hasta el post-parto.</p>
            <Button onClick={() => setShowNuevaGestacion(true)}>Registrar nueva gestacion</Button>
          </div>
        </section>

        <Modal isOpen={showNuevaGestacion} onClose={() => setShowNuevaGestacion(false)} title="Nueva gestacion">
          <form className="petbook-form" onSubmit={handleCrearGestacion}>
            <label>
              Mascota
              <input value={mascota.nombre} disabled />
            </label>
            <label>
              Fecha del cruce *
              <input type="date" value={gestacionForm.fechaCruce} onChange={(event) => setGestacionForm((prev) => ({ ...prev, fechaCruce: event.target.value }))} required />
            </label>
            <label>
              Tipo de cruce
              <select value={gestacionForm.tipoCruce} onChange={(event) => setGestacionForm((prev) => ({ ...prev, tipoCruce: event.target.value }))}>
                <option value="natural">Natural</option>
                <option value="inseminacion">Inseminacion artificial</option>
              </select>
            </label>
            <label>
              Macho reproductor
              <input value={gestacionForm.machoReproductor} onChange={(event) => setGestacionForm((prev) => ({ ...prev, machoReproductor: event.target.value }))} />
            </label>
            <label>
              Cantidad de crias esperadas
              <input value={gestacionForm.cantidadCriasEsperadas} onChange={(event) => setGestacionForm((prev) => ({ ...prev, cantidadCriasEsperadas: event.target.value }))} />
            </label>
            <label>
              Veterinario de seguimiento
              <input value={gestacionForm.veterinarioSeguimiento} onChange={(event) => setGestacionForm((prev) => ({ ...prev, veterinarioSeguimiento: event.target.value }))} />
            </label>
            <label>
              Notas iniciales
              <textarea value={gestacionForm.notas} onChange={(event) => setGestacionForm((prev) => ({ ...prev, notas: event.target.value }))} />
            </label>
            {formError && <Alert tone="danger">{formError}</Alert>}
            <Button type="submit">Guardar gestacion</Button>
          </form>
        </Modal>
      </>
    )
  }

  return (
    <>
      <section className="petbook-page">
        <header className="petbook-page-header">
          <div>
            <p className="petbook-kicker">{gestacion.estado === 'finalizada' ? 'Camada' : 'Gestacion'}</p>
            <h2>{gestacion.estado === 'finalizada' ? `Camada de ${mascota.nombre}` : `Gestacion de ${mascota.nombre}`}</h2>
            <p>{mascota.especie} - {mascota.raza}</p>
          </div>
          <div className="petbook-inline petbook-inline--stretch">
            <Badge tone={gestacion.estado === 'finalizada' ? 'accent' : 'success'}>
              {gestacion.estado === 'finalizada' ? 'Finalizada' : 'En curso'}
            </Badge>
          </div>
        </header>

        {error && <Alert tone="danger">{error}</Alert>}
        {formError && <Alert tone="danger">{formError}</Alert>}
        {alertaParto && <Alert tone="danger">Atencion: quedan {Math.max(diasRestantes, 0)} dias para la fecha probable de parto.</Alert>}

        {gestacion.estado === 'en_curso' ? (
          <>
            <div className="petbook-grid petbook-grid--dashboard petbook-grid--gestacion-summary">
              <Card title="Fecha de cruce">
                <strong>{formatearFechaLarga(gestacion.fechaCruce)}</strong>
              </Card>
              <Card title="Fecha probable de parto">
                <strong>{formatearFechaLarga(gestacion.fechaPartoProbable)}</strong>
              </Card>
              <Card title="Dias restantes">
                <strong>{diasRestantes ?? '-'}</strong>
              </Card>
            </div>

            <Card title={`Semana ${semanaActual}`} subtitle={`Dia ${diaActual} de seguimiento`}>
              <div className="petbook-stack">
                <ProgressBar value={progreso} etiqueta={`${progreso}%`} />
                <p>Dia {diaActual} de la gestacion.</p>
              </div>
            </Card>

            <Card title="Hito actual" subtitle="Tu seguimiento de hoy">
              {hitoActual ? (
                <div className="petbook-stack">
                  <strong>{hitoActual.titulo}</strong>
                  <p>{hitoActual.descripcion}</p>
                </div>
              ) : (
                <p>Aun no hay un hito cumplido.</p>
              )}
            </Card>

            <Card title="Linea de tiempo" subtitle="Hitos clave del embarazo">
              <div className="petbook-gestation-timeline">
                {timeline.map((hito) => (
                  <article key={hito.id} className={`petbook-gestation-timeline__item is-${hito.estado}`}>
                    <span className="petbook-gestation-timeline__bullet">
                      {hito.estado === 'completado' ? 'OK' : hito.estado === 'actual' ? 'AH' : '..'}
                    </span>
                    <div>
                      <strong>{hito.titulo}</strong>
                      <p>Dia {hito.dia} - {hito.descripcion}</p>
                      <span>{formatearFechaCorta(hito.fecha)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <div className="petbook-grid petbook-grid--dashboard">
              <Card title="Datos adicionales" subtitle="Resumen veterinario">
                <div className="petbook-definition-list">
                  <span>Veterinario</span>
                  <strong>{gestacion.veterinarioSeguimiento || 'Sin dato'}</strong>
                  <span>Crias esperadas</span>
                  <strong>{gestacion.cantidadCriasEsperadas || 'Sin dato'}</strong>
                  <span>Tipo de cruce</span>
                  <strong>{gestacion.tipoCruce || 'Sin dato'}</strong>
                  <span>Macho reproductor</span>
                  <strong>{gestacion.machoReproductor || 'Sin dato'}</strong>
                </div>
              </Card>

              <Card title="Proximos hitos" subtitle="Lo que viene">
                <div className="petbook-stack">
                  {hitosProximos.map((hito) => (
                    <div key={hito.dia} className="petbook-gestation-mini">
                      <strong>{hito.titulo}</strong>
                      <span>Dia {hito.dia}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card title="Notas de seguimiento" subtitle="Campo editable">
              <div className="petbook-form">
                <label>
                  Notas
                  <textarea value={notas || gestacion.notas || ''} onChange={(event) => setNotas(event.target.value)} />
                </label>
                <div className="petbook-inline">
                  <Button variant="secondary" onClick={handleGuardarNotas}>
                    Guardar notas
                  </Button>
                  <Button onClick={() => setShowPartoModal(true)}>Registrar parto / Nacimiento</Button>
                  <Button variant="ghost" onClick={openEditGestacion}>
                    Editar datos de gestacion
                  </Button>
                  <Button variant="ghost" onClick={() => setShowCancelarModal(true)}>
                    Cancelar gestacion
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : gestacion.estado === 'finalizada' ? (
          <>
            <Card title="Resumen del parto" subtitle="Datos principales de la camada">
              <div className="petbook-definition-list">
                <span>Fecha de nacimiento</span>
                <strong>{formatearFechaLarga(gestacion.fechaPartoReal)}</strong>
                <span>Tipo de parto</span>
                <strong>{gestacion.tipoParto || 'Sin dato'}</strong>
                <span>Total de crias</span>
                <strong>{gestacion.cantidadCriasNacidas || crias.length}</strong>
                <span>Crias vivas</span>
                <strong>{gestacion.cantidadCriasVivas || '-'}</strong>
              </div>
            </Card>

            <Card title="Crias registradas" subtitle="Seguimiento post-parto">
              {crias.length === 0 ? (
                <p>Aun no hay crias registradas para esta gestacion.</p>
              ) : (
                <div className="petbook-grid">
                  {crias.map((cria) => (
                    <article key={cria.id} className="petbook-gestation-cub">
                      <div className="petbook-stack">
                        <strong>{cria.nombre}</strong>
                        <span>{cria.sexo}</span>
                        <span>{cria.color || 'Sin color'}</span>
                        <span>{cria.pesoNacimiento} gramos</span>
                        <Badge tone={cria.estado === 'adoptada' ? 'warning' : 'success'}>{cria.estado}</Badge>
                      </div>
                      <div className="petbook-inline">
                        <Button
                          variant="secondary"
                          onClick={() => handleCrearFichaCria(cria.id)}
                          disabled={Boolean(cria.mascotaId)}
                        >
                          {cria.mascotaId ? 'Ficha creada' : 'Crear ficha completa'}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setEditingCria(cria)
                            setCriaForm({
                              nombre: cria.nombre,
                              sexo: cria.sexo,
                              color: cria.color,
                              pesoNacimiento: cria.pesoNacimiento,
                              estado: cria.estado,
                              observaciones: cria.observaciones || '',
                            })
                          }}
                        >
                          Editar
                        </Button>
                        <Button variant="ghost" onClick={() => marcarCriaAdoptada(cria.id)}>
                          Marcar adoptada/vendida
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Recordatorios automaticos" subtitle="Generados al registrar el nacimiento">
              <ul className="petbook-list">
                <li>Destete sugerido a los 60 dias desde el nacimiento.</li>
                <li>Primera vacuna programada para cada cria.</li>
              </ul>
            </Card>
          </>
        ) : (
          <Card title="Gestacion cancelada" subtitle="Registro historico">
            <p>Esta gestacion fue cancelada y quedo guardada como antecedente clinico.</p>
            <p>Motivo: {gestacion.motivoCancelacion || 'Sin motivo registrado'}</p>
          </Card>
        )}
      </section>

      <Modal isOpen={showEditarGestacion} onClose={() => setShowEditarGestacion(false)} title="Editar gestacion">
        <form className="petbook-form" onSubmit={handleEditarGestacion}>
          <label>
            Fecha del cruce *
            <input type="date" value={gestacionForm.fechaCruce} onChange={(event) => setGestacionForm((prev) => ({ ...prev, fechaCruce: event.target.value }))} required />
          </label>
          <label>
            Tipo de cruce
            <select value={gestacionForm.tipoCruce} onChange={(event) => setGestacionForm((prev) => ({ ...prev, tipoCruce: event.target.value }))}>
              <option value="natural">Natural</option>
              <option value="inseminacion">Inseminacion artificial</option>
            </select>
          </label>
          <label>
            Macho reproductor
            <input value={gestacionForm.machoReproductor} onChange={(event) => setGestacionForm((prev) => ({ ...prev, machoReproductor: event.target.value }))} />
          </label>
          <label>
            Cantidad de crias esperadas
            <input value={gestacionForm.cantidadCriasEsperadas} onChange={(event) => setGestacionForm((prev) => ({ ...prev, cantidadCriasEsperadas: event.target.value }))} />
          </label>
          <label>
            Veterinario de seguimiento
            <input value={gestacionForm.veterinarioSeguimiento} onChange={(event) => setGestacionForm((prev) => ({ ...prev, veterinarioSeguimiento: event.target.value }))} />
          </label>
          <label>
            Notas
            <textarea value={gestacionForm.notas} onChange={(event) => setGestacionForm((prev) => ({ ...prev, notas: event.target.value }))} />
          </label>
          <Button type="submit">Guardar cambios</Button>
        </form>
      </Modal>

      <Modal isOpen={showCancelarModal} onClose={() => setShowCancelarModal(false)} title="Cancelar gestacion">
        <form className="petbook-form" onSubmit={handleCancelarGestacion}>
          <label>
            Motivo
            <textarea value={motivoCancelacion} onChange={(event) => setMotivoCancelacion(event.target.value)} />
          </label>
          <Button type="submit">Confirmar cancelacion</Button>
        </form>
      </Modal>

      <Modal isOpen={showPartoModal} onClose={() => setShowPartoModal(false)} title="Registrar nacimiento">
        <form className="petbook-form" onSubmit={handleRegistrarParto}>
          <label>
            Fecha del parto *
            <input type="date" value={partoForm.fechaPartoReal} onChange={(event) => setPartoForm((prev) => ({ ...prev, fechaPartoReal: event.target.value }))} required />
          </label>
          <label>
            Hora del parto
            <input type="time" value={partoForm.horaParto} onChange={(event) => setPartoForm((prev) => ({ ...prev, horaParto: event.target.value }))} />
          </label>
          <label>
            Tipo de parto
            <select value={partoForm.tipoParto} onChange={(event) => setPartoForm((prev) => ({ ...prev, tipoParto: event.target.value }))}>
              <option value="natural">Natural</option>
              <option value="cesarea">Cesarea</option>
            </select>
          </label>
          <label>
            Cantidad de crias nacidas *
            <input value={partoForm.cantidadCriasNacidas} onChange={(event) => setPartoForm((prev) => ({ ...prev, cantidadCriasNacidas: event.target.value }))} required />
          </label>
          <label>
            Crias vivas *
            <input value={partoForm.cantidadCriasVivas} onChange={(event) => setPartoForm((prev) => ({ ...prev, cantidadCriasVivas: event.target.value }))} required />
          </label>
          <label>
            Crias sin vida
            <input value={partoForm.cantidadCriasSinVida} onChange={(event) => setPartoForm((prev) => ({ ...prev, cantidadCriasSinVida: event.target.value }))} />
          </label>
          <label>
            Peso promedio (gramos)
            <input value={partoForm.pesoPromedioCrias} onChange={(event) => setPartoForm((prev) => ({ ...prev, pesoPromedioCrias: event.target.value }))} />
          </label>
          <label>
            Veterinario presente
            <input value={partoForm.veterinarioPresente} onChange={(event) => setPartoForm((prev) => ({ ...prev, veterinarioPresente: event.target.value }))} />
          </label>
          <label>
            Complicaciones
            <textarea value={partoForm.complicaciones} onChange={(event) => setPartoForm((prev) => ({ ...prev, complicaciones: event.target.value }))} />
          </label>
          <label>
            Notas generales
            <textarea value={partoForm.notasGenerales} onChange={(event) => setPartoForm((prev) => ({ ...prev, notasGenerales: event.target.value }))} />
          </label>

          <div className="petbook-stack">
            <div className="petbook-inline petbook-inline--stretch">
              <strong>Crias</strong>
              <Button variant="secondary" onClick={addCria}>
                +
              </Button>
            </div>
            {partoForm.crias.map((cria, index) => (
              <div key={`draft-${index}`} className="petbook-gestation-cub petbook-gestation-cub--draft">
                <label>
                  Nombre provisional
                  <input value={cria.nombre} onChange={(event) => updateCriaDraft(index, 'nombre', event.target.value)} />
                </label>
                <label>
                  Sexo
                  <select value={cria.sexo} onChange={(event) => updateCriaDraft(index, 'sexo', event.target.value)}>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                    <option value="no determinado">No determinado</option>
                  </select>
                </label>
                <label>
                  Peso al nacer (gramos)
                  <input value={cria.pesoNacimiento} onChange={(event) => updateCriaDraft(index, 'pesoNacimiento', event.target.value)} />
                </label>
                <label>
                  Color / caracteristicas
                  <input value={cria.color} onChange={(event) => updateCriaDraft(index, 'color', event.target.value)} />
                </label>
                <label>
                  Observaciones
                  <textarea value={cria.observaciones} onChange={(event) => updateCriaDraft(index, 'observaciones', event.target.value)} />
                </label>
              </div>
            ))}
          </div>

          <Button type="submit">Registrar nacimiento</Button>
        </form>
      </Modal>

      <Modal isOpen={Boolean(editingCria)} onClose={() => setEditingCria(null)} title="Editar cria">
        <form className="petbook-form" onSubmit={handleActualizarCria}>
          <label>
            Nombre
            <input value={criaForm?.nombre || ''} onChange={(event) => setCriaForm((prev) => ({ ...prev, nombre: event.target.value }))} />
          </label>
          <label>
            Sexo
            <select value={criaForm?.sexo || 'no determinado'} onChange={(event) => setCriaForm((prev) => ({ ...prev, sexo: event.target.value }))}>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
              <option value="no determinado">No determinado</option>
            </select>
          </label>
          <label>
            Color
            <input value={criaForm?.color || ''} onChange={(event) => setCriaForm((prev) => ({ ...prev, color: event.target.value }))} />
          </label>
          <label>
            Peso al nacer
            <input value={criaForm?.pesoNacimiento || ''} onChange={(event) => setCriaForm((prev) => ({ ...prev, pesoNacimiento: event.target.value }))} />
          </label>
          <label>
            Estado
            <select value={criaForm?.estado || 'vivo'} onChange={(event) => setCriaForm((prev) => ({ ...prev, estado: event.target.value }))}>
              <option value="vivo">Vivo</option>
              <option value="adoptada">Adoptada/Vendida</option>
            </select>
          </label>
          <label>
            Observaciones
            <textarea value={criaForm?.observaciones || ''} onChange={(event) => setCriaForm((prev) => ({ ...prev, observaciones: event.target.value }))} />
          </label>
          <Button type="submit">Guardar cria</Button>
        </form>
      </Modal>
    </>
  )
}

export default Gestacion
