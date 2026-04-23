import { useParams } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../components/ui/Card'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'
import { formatearFechaLarga } from '../../ArchivosJS/utils/fechas'

function DiarioSalud() {
  const { mascotaId } = useParams()
  const { mascota, notasSalud, pesoHistorial } = useMascota(mascotaId)

  return (
    <section className="petbook-page">
      <Card title={`Diario de salud${mascota ? ` de ${mascota.nombre}` : ''}`} subtitle="Vista dedicada del historial clinico">
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
            </article>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default DiarioSalud
