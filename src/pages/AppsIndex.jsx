import { Link } from 'react-router-dom'
import './AppsIndex.css'

/*
  Para agregar una nueva app de prÃ¡ctica:
  1. CreÃ¡ la carpeta en src/apps/nombre-app/
  2. AgregÃ¡ el componente y su CSS
  3. RegistrÃ¡ la ruta en App.jsx
  4. SumÃ¡ el objeto a este array
*/
const apps = [
  {
    id: 'hola-mundo',
    titulo: 'Hola Mundo',
    descripcion: 'Tu primera app interactiva. AprendÃ© a usar useState, manejar eventos de inputs y renderizado condicional en React.',
    etiquetas: ['React', 'useState', 'Eventos'],
    modulo: '05',
  },
  {
    id: 'memorama',
    titulo: 'Memorama',
    descripcion: 'Juego de memoria: encontrÃ¡ los 8 pares de cartas. PracticÃ¡ estado, arrays y timers en React.',
    etiquetas: ['React', 'useState', 'setTimeout', 'Array.map'],
    modulo: '05',
  },
  {
    id: 'gestor-tareas',
    titulo: 'Gestor de Tareas',
    descripcion: 'CRUD completo: creÃ¡, editÃ¡, completÃ¡ y eliminÃ¡ tareas. Persistencia con localStorage.',
    etiquetas: ['CRUD', 'localStorage', 'useEffect', 'Filtros'],
    modulo: '05',
  },
  {
    id: 'scape-room',
    titulo: 'Scape-Room',
    descripcion: 'Nueva miniapp del curso. Punto de partida para construir un juego por etapas en React.',
    etiquetas: ['React', 'Juego', 'Interacción'],
    modulo: '05',
  },
]

function AppsIndex() {
  return (
    <div className="apps-index">
      <div className="apps-index__header">
        <h1>Aplicaciones de PrÃ¡ctica</h1>
        <p>
          Mini-aplicaciones aisladas para practicar los conceptos de cada mÃ³dulo.
          Cada una estÃ¡ en su propia carpeta dentro de <code>src/apps/</code>.
        </p>
      </div>

      <div className="apps-index__grilla">
        {apps.map((app) => (
          <Link key={app.id} to={`/apps/${app.id}`} className="app-card">
            <div className="app-card__modulo">MÃ³dulo {app.modulo}</div>
            <h2 className="app-card__titulo">{app.titulo}</h2>
            <p className="app-card__descripcion">{app.descripcion}</p>
            <div className="app-card__etiquetas">
              {app.etiquetas.map((e) => (
                <span key={e} className="app-card__etiqueta">{e}</span>
              ))}
            </div>
            <span className="app-card__ir">Ver aplicaciÃ³n â†’</span>
          </Link>
        ))}

        {/* Placeholder para apps futuras */}
        <div className="app-card app-card--proximamente">
          <div className="app-card__modulo">PrÃ³ximamente</div>
          <h2 className="app-card__titulo">MÃ¡s apps en camino...</h2>
          <p className="app-card__descripcion">
            Se irÃ¡n sumando nuevas aplicaciones a medida que avancemos en el curso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AppsIndex

