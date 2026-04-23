import { useMemo, useState } from 'react'
import { addMonths, format, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import { useCalendarioEventos } from '../../ArchivosJS/hooks/useCalendarioEventos'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useRecordatorios } from '../../ArchivosJS/hooks/useRecordatorios'
import {
  EVENT_TYPE_META,
  RECORDATORIO_REPETICIONES,
  RECORDATORIO_TIPOS,
} from '../../ArchivosJS/utils/constants'
import { esMismoMes, formatearFechaCorta, obtenerDiasDelMes } from '../../ArchivosJS/utils/fechas'

const reminderInitialState = {
  mascotaId: '',
  titulo: '',
  fecha: '',
  hora: '',
  tipo: 'otro',
  notas: '',
  repetir: 'no',
}

function Calendario() {
  const { mascotas, mascotaActiva } = useMascota()
  const { recordatorios, crearRecordatorio, editarRecordatorio, marcarCompletado } = useRecordatorios()
  const { eventos, proximosEventos, loading, obtenerEventosDeFecha, recargarEventos } = useCalendarioEventos()
  const [mesActual, setMesActual] = useState(new Date())
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [filtroMascota, setFiltroMascota] = useState('todas')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [formState, setFormState] = useState({
    ...reminderInitialState,
    mascotaId: mascotaActiva?.id ? String(mascotaActiva.id) : '',
  })

  const diasMes = useMemo(() => obtenerDiasDelMes(mesActual), [mesActual])

  const eventosFiltrados = useMemo(
    () =>
      eventos.filter((evento) => {
        const coincideMascota = filtroMascota === 'todas' || evento.mascotaId === Number(filtroMascota)
        const coincideTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo
        return coincideMascota && coincideTipo
      }),
    [eventos, filtroMascota, filtroTipo],
  )

  const eventosPorDia = useMemo(() => {
    const mapa = new Map()

    eventosFiltrados.forEach((evento) => {
      const key = evento.fecha
      mapa.set(key, [...(mapa.get(key) || []), evento])
    })

    return mapa
  }, [eventosFiltrados])

  const eventosDelDia = useMemo(
    () =>
      eventosFiltrados.filter((evento) => {
        const sameDate = formatearFechaCorta(evento.fecha) === formatearFechaCorta(fechaSeleccionada)
        return sameDate
      }),
    [eventosFiltrados, fechaSeleccionada],
  )

  const proximosFiltrados = useMemo(
    () =>
      proximosEventos.filter((evento) => {
        const coincideMascota = filtroMascota === 'todas' || evento.mascotaId === Number(filtroMascota)
        const coincideTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo
        return coincideMascota && coincideTipo
      }),
    [filtroMascota, filtroTipo, proximosEventos],
  )

  async function handleReminderSubmit(event) {
    event.preventDefault()

    const payload = {
      ...formState,
      mascotaId: Number(formState.mascotaId),
    }

    if (editingReminder) {
      await editarRecordatorio(editingReminder.id, {
        ...editingReminder,
        ...payload,
      })
    } else {
      await crearRecordatorio(payload)
    }

    setShowReminderModal(false)
    setEditingReminder(null)
    setFormState({
      ...reminderInitialState,
      mascotaId: mascotaActiva?.id ? String(mascotaActiva.id) : '',
    })
    recargarEventos()
  }

  async function handleMarcarCompletado(evento) {
    if (evento.origen !== 'recordatorios') return
    await marcarCompletado(evento.refId)
    recargarEventos()
  }

  function openCreateReminder() {
    setEditingReminder(null)
    setFormState({
      ...reminderInitialState,
      fecha: format(fechaSeleccionada, 'yyyy-MM-dd'),
      mascotaId: mascotaActiva?.id ? String(mascotaActiva.id) : '',
    })
    setShowReminderModal(true)
  }

  function openEditReminder(evento) {
    const reminder = recordatorios.find((item) => item.id === evento.refId)
    if (!reminder) return

    setEditingReminder(reminder)
    setFormState({
      mascotaId: String(reminder.mascotaId),
      titulo: reminder.titulo || '',
      fecha: reminder.fecha || '',
      hora: reminder.hora || '',
      tipo: reminder.tipo || 'otro',
      notas: reminder.notas || '',
      repetir: reminder.repetir || 'no',
    })
    setShowReminderModal(true)
  }

  if (loading) {
    return <Loader label="Armando calendario de salud..." />
  }

  return (
    <>
      <section className="petbook-page">
        <header className="petbook-page-header">
          <div>
            <p className="petbook-kicker">Calendario</p>
            <h2>Eventos de salud y recordatorios</h2>
            <p>Vista mensual consolidada con vacunas, consultas, gestacion y pendientes personales.</p>
          </div>
          <div className="petbook-inline petbook-inline--stretch">
            <Button variant="secondary" onClick={() => setMesActual(new Date())}>
              Hoy
            </Button>
            <Button onClick={openCreateReminder}>Nuevo recordatorio</Button>
          </div>
        </header>

        <div className="petbook-grid petbook-grid--calendar">
          <Card
            title={format(mesActual, "MMMM 'de' yyyy", { locale: es })}
            subtitle="Haz click en un dia para ver sus eventos"
            actions={
              <div className="petbook-inline">
                <Button variant="ghost" onClick={() => setMesActual((prev) => subMonths(prev, 1))}>
                  Anterior
                </Button>
                <Button variant="ghost" onClick={() => setMesActual((prev) => addMonths(prev, 1))}>
                  Siguiente
                </Button>
              </div>
            }
          >
            <div className="petbook-calendar-filters">
              <label>
                Mascota
                <select value={filtroMascota} onChange={(event) => setFiltroMascota(event.target.value)}>
                  <option value="todas">Todas</option>
                  {mascotas.map((mascota) => (
                    <option key={mascota.id} value={mascota.id}>
                      {mascota.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tipo
                <select value={filtroTipo} onChange={(event) => setFiltroTipo(event.target.value)}>
                  <option value="todos">Todos</option>
                  {Object.entries(EVENT_TYPE_META).map(([key, meta]) => (
                    <option key={key} value={key}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="petbook-calendar-legend">
              {Object.entries(EVENT_TYPE_META).map(([key, meta]) => (
                <span key={key} className="petbook-calendar-legend__item">
                  <span className={`petbook-event-dot petbook-event-dot--${key}`} />
                  {meta.label}
                </span>
              ))}
            </div>

            <div className="petbook-calendar-grid">
              {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((label) => (
                <span key={label} className="petbook-calendar-grid__weekday">
                  {label}
                </span>
              ))}

              {diasMes.map((dia) => {
                const key = format(dia, 'yyyy-MM-dd')
                const eventosDia = eventosPorDia.get(key) || []

                return (
                  <button
                    key={key}
                    type="button"
                    className={`petbook-calendar-day ${esMismoMes(dia, mesActual) ? '' : 'is-outside'} ${
                      formatearFechaCorta(dia) === formatearFechaCorta(fechaSeleccionada) ? 'is-selected' : ''
                    }`}
                    onClick={() => setFechaSeleccionada(dia)}
                  >
                    <span className="petbook-calendar-day__number">{format(dia, 'd')}</span>
                    <div className="petbook-calendar-day__dots">
                      {eventosDia.slice(0, 4).map((evento) => (
                        <span key={evento.id} className={`petbook-event-dot petbook-event-dot--${evento.tipo}`} />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="petbook-calendar-mobile">
              {diasMes
                .filter((dia) => esMismoMes(dia, mesActual))
                .map((dia) => {
                  const eventosDia = obtenerEventosDeFecha(dia).filter((evento) => {
                    const coincideMascota = filtroMascota === 'todas' || evento.mascotaId === Number(filtroMascota)
                    const coincideTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo
                    return coincideMascota && coincideTipo
                  })

                  return (
                    <article key={format(dia, 'yyyy-MM-dd')} className="petbook-calendar-mobile__day">
                      <strong>{format(dia, "d 'de' MMMM", { locale: es })}</strong>
                      {eventosDia.length === 0 ? <p>Sin eventos.</p> : null}
                      {eventosDia.map((evento) => (
                        <div key={evento.id} className="petbook-event-list__item">
                          <span className={`petbook-event-dot petbook-event-dot--${evento.tipo}`} />
                          <div className="petbook-stack">
                            <strong>{evento.titulo}</strong>
                            <span>{evento.descripcion}</span>
                          </div>
                        </div>
                      ))}
                    </article>
                  )
                })}
            </div>
          </Card>

          <div className="petbook-stack">
            <Card
              title={`Eventos del ${format(fechaSeleccionada, "d 'de' MMMM", { locale: es })}`}
              subtitle="Detalle del dia seleccionado"
            >
              {eventosDelDia.length === 0 ? (
                <p>No hay eventos para esta fecha.</p>
              ) : (
                <div className="petbook-event-list">
                  {eventosDelDia.map((evento) => (
                    <article key={evento.id} className={`petbook-event-list__item petbook-event-list__item--${evento.tipo}`}>
                      <span className={`petbook-event-dot petbook-event-dot--${evento.tipo}`}>{EVENT_TYPE_META[evento.tipo]?.icon || 'E'}</span>
                      <div className="petbook-stack">
                        <strong>{evento.titulo}</strong>
                        <span>{evento.mascotaNombre}</span>
                        <span>{evento.descripcion}</span>
                      </div>
                      <div className="petbook-inline">
                        {evento.origen === 'recordatorios' && !evento.completado && (
                          <Button variant="secondary" onClick={() => handleMarcarCompletado(evento)}>
                            Completar
                          </Button>
                        )}
                        {evento.origen === 'recordatorios' && (
                          <Button variant="ghost" onClick={() => openEditReminder(evento)}>
                            Editar
                          </Button>
                        )}
                        {evento.completado && <Badge tone="neutral">Completado</Badge>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Proximos eventos" subtitle="Resumen de los proximos 7 dias">
              {proximosFiltrados.length === 0 ? (
                <p>No hay eventos cercanos con los filtros actuales.</p>
              ) : (
                <div className="petbook-event-list">
                  {proximosFiltrados.map((evento) => (
                    <article key={evento.id} className={`petbook-event-list__item petbook-event-list__item--${evento.tipo}`}>
                      <span className={`petbook-event-dot petbook-event-dot--${evento.tipo}`} />
                      <div className="petbook-stack">
                        <strong>{evento.titulo}</strong>
                        <span>
                          {evento.mascotaNombre} - {formatearFechaCorta(evento.fecha)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <Modal
        isOpen={showReminderModal}
        onClose={() => {
          setShowReminderModal(false)
          setEditingReminder(null)
        }}
        title={editingReminder ? 'Editar recordatorio' : 'Nuevo recordatorio'}
      >
        <form className="petbook-form" onSubmit={handleReminderSubmit}>
          <label>
            Mascota *
            <select
              value={formState.mascotaId}
              onChange={(event) => setFormState((prev) => ({ ...prev, mascotaId: event.target.value }))}
              required
            >
              <option value="">Seleccionar</option>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Titulo *
            <input value={formState.titulo} onChange={(event) => setFormState((prev) => ({ ...prev, titulo: event.target.value }))} required />
          </label>
          <label>
            Fecha *
            <input type="date" value={formState.fecha} onChange={(event) => setFormState((prev) => ({ ...prev, fecha: event.target.value }))} required />
          </label>
          <label>
            Hora
            <input type="time" value={formState.hora} onChange={(event) => setFormState((prev) => ({ ...prev, hora: event.target.value }))} />
          </label>
          <label>
            Tipo
            <select value={formState.tipo} onChange={(event) => setFormState((prev) => ({ ...prev, tipo: event.target.value }))}>
              {RECORDATORIO_TIPOS.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Repetir
            <select value={formState.repetir} onChange={(event) => setFormState((prev) => ({ ...prev, repetir: event.target.value }))}>
              {RECORDATORIO_REPETICIONES.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Notas
            <textarea value={formState.notas} onChange={(event) => setFormState((prev) => ({ ...prev, notas: event.target.value }))} />
          </label>
          <Button type="submit">{editingReminder ? 'Guardar cambios' : 'Crear recordatorio'}</Button>
        </form>
      </Modal>
    </>
  )
}

export default Calendario
