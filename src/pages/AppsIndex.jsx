import { Link } from 'react-router-dom'
import './AppsIndex.css'

/*
  Para agregar una nueva app de practica:
  1. Crea la carpeta en src/apps/nombre-app/
  2. Agrega el componente y su CSS
  3. Registra la ruta en App.jsx
  4. Suma el objeto a este array
*/
const apps = [
  {
    id: 'hola-mundo',
    titulo: 'Hola Mundo',
    descripcion: 'Tu primera app interactiva. Aprende a usar useState, manejar eventos de inputs y renderizado condicional en React.',
    etiquetas: ['React', 'useState', 'Eventos'],
    modulo: '05',
  },
  {
    id: 'memorama',
    titulo: 'Memorama',
    descripcion: 'Juego de memoria: encontra los 8 pares de cartas. Practica estado, arrays y timers en React.',
    etiquetas: ['React', 'useState', 'setTimeout', 'Array.map'],
    modulo: '05',
  },
  {
    id: 'gestor-tareas',
    titulo: 'Gestor de Tareas',
    descripcion: 'CRUD completo: crea, edita, completa y elimina tareas. Persistencia con localStorage.',
    etiquetas: ['CRUD', 'localStorage', 'useEffect', 'Filtros'],
    modulo: '05',
  },
  {
    id: 'scape-room',
    titulo: 'Scape-Room',
    descripcion: 'Nueva miniapp del curso. Punto de partida para construir un juego por etapas en React.',
    etiquetas: ['React', 'Juego', 'Interaccion'],
    modulo: '05',
  },
  {
    id: 'pokedex',
    titulo: 'Pokedex',
    descripcion: 'Busca cualquier pokemon por nombre o numero usando la PokeAPI. Practica fetch, async/await y manejo de estados de carga.',
    etiquetas: ['fetch', 'async/await', 'try/catch', 'Estados UI'],
    modulo: '04',
  },
  {
    id: 'sopa-de-letras',
    titulo: 'Sopa de Letras',
    descripcion: 'Armá tu propia sopa, configurá el tiempo y encontrá todas las palabras antes de que termine el desafío.',
    etiquetas: ['React', 'useState', 'Timers', 'Lógica de juego'],
    modulo: '05',
  },
]

function AppsIndex() {
  return (
    <div className="apps-index">
      <div className="apps-index__header">
        <h1>Aplicaciones de Practica</h1>
        <p>
          Mini-aplicaciones aisladas para practicar los conceptos de cada modulo.
          Cada una esta en su propia carpeta dentro de <code>src/apps/</code>.
        </p>
      </div>

      <div className="apps-index__grilla">
        {apps.map((app) => (
          <Link key={app.id} to={`/apps/${app.id}`} className="app-card">
            <div className="app-card__modulo">Modulo {app.modulo}</div>
            <h2 className="app-card__titulo">{app.titulo}</h2>
            <p className="app-card__descripcion">{app.descripcion}</p>
            <div className="app-card__etiquetas">
              {app.etiquetas.map((e) => (
                <span key={e} className="app-card__etiqueta">{e}</span>
              ))}
            </div>
            <span className="app-card__ir">Ver aplicacion -&gt;</span>
          </Link>
        ))}

        <div className="app-card app-card--proximamente">
          <div className="app-card__modulo">Proximamente</div>
          <h2 className="app-card__titulo">Mas apps en camino...</h2>
          <p className="app-card__descripcion">
            Se iran sumando nuevas aplicaciones a medida que avancemos en el curso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AppsIndex
