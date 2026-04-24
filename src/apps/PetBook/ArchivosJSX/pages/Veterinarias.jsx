import { useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { useVeterinarias } from '../../ArchivosJS/hooks/useVeterinarias'

function buildDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

function Veterinarias() {
  const { mascotaActiva, actualizarMascota } = useMascota()
  const [radio, setRadio] = useState(5000)
  const [ciudadManual, setCiudadManual] = useState('')
  const { veterinarias, posicion, loading, error, buscarPorCiudad } = useVeterinarias(null, null, radio)

  const center = useMemo(() => [posicion.lat, posicion.lng], [posicion.lat, posicion.lng])

  async function guardarVeterinario(veterinaria) {
    if (!mascotaActiva) return

    await actualizarMascota(mascotaActiva.id, {
      ...mascotaActiva,
      veterinario: veterinaria.nombre,
      telefonoVet: veterinaria.telefono || mascotaActiva.telefonoVet || '',
    })
  }

  async function handleBuscarCiudad(event) {
    event.preventDefault()
    if (!ciudadManual.trim()) return
    await buscarPorCiudad(ciudadManual)
  }

  return (
    <section className="petbook-page">
      <header className="petbook-page-header">
        <div>
          <p className="petbook-kicker">Veterinarias</p>
          <h2>Veterinarias cercanas</h2>
          <p>{posicion.label}</p>
        </div>
      </header>

      {error && <Alert tone="info">{error}</Alert>}

      <div className="petbook-grid petbook-grid--calendar">
        <Card title="Mapa" subtitle={loading ? 'Buscando resultados...' : `${veterinarias.length} resultados`}>
          <div className="petbook-stack">
            <label>
              Radio de busqueda
              <input
                type="range"
                min="1000"
                max="10000"
                step="1000"
                value={radio}
                onChange={(event) => setRadio(Number(event.target.value))}
              />
              <span>{Math.round(radio / 1000)} km</span>
            </label>

            <form className="petbook-inline petbook-inline--stretch" onSubmit={handleBuscarCiudad}>
              <input
                className="petbook-chat__input"
                value={ciudadManual}
                onChange={(event) => setCiudadManual(event.target.value)}
                placeholder="Buscar ciudad manualmente"
              />
              <Button type="submit" variant="secondary">
                Buscar en esta zona
              </Button>
            </form>

            <div className="petbook-map">
              <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                  <Popup>Tu ubicacion aproximada</Popup>
                </Marker>
                {veterinarias.map((veterinaria) => (
                  <Marker key={veterinaria.id} position={[veterinaria.lat, veterinaria.lng]}>
                    <Popup>
                      <strong>{veterinaria.nombre}</strong>
                      <br />
                      {veterinaria.direccion || 'Direccion no disponible'}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </Card>

        <Card title="Resultados" subtitle="Lista sincronizada con el mapa">
          {veterinarias.length === 0 ? (
            <p>No se encontraron veterinarias en esta zona.</p>
          ) : (
            <div className="petbook-event-list">
              {veterinarias.map((veterinaria) => (
                <article key={veterinaria.id} className="petbook-vet-item">
                  <div className="petbook-stack">
                    <strong>{veterinaria.nombre}</strong>
                    <span>{veterinaria.direccion || 'Direccion no disponible'}</span>
                    <span>{veterinaria.telefono || 'Telefono no informado'}</span>
                    <span>{veterinaria.horario || 'Horario no informado'}</span>
                  </div>
                  <div className="petbook-inline">
                    <a className="petbook-link" href={buildDirectionsUrl(veterinaria.lat, veterinaria.lng)} target="_blank" rel="noreferrer">
                      Como llegar
                    </a>
                    {veterinaria.telefono && <a className="petbook-link" href={`tel:${veterinaria.telefono}`}>Llamar</a>}
                    {mascotaActiva && (
                      <Button variant="secondary" onClick={() => guardarVeterinario(veterinaria)}>
                        Guardar como mi veterinario
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}

export default Veterinarias
