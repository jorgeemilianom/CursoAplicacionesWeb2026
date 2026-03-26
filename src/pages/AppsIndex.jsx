import { Link } from 'react-router-dom'
import './AppsIndex.css'

/*
  Para agregar una nueva app de práctica:
  1. Creá la carpeta en src/apps/nombre-app/
  2. Agregá el componente y su CSS
  3. Registrá la ruta en App.jsx
  4. Sumá el objeto a este array
*/
const apps = [
  {
    id: 'hola-mundo',
    titulo: 'Hola Mundo',
    descripcion: 'Tu primera app interactiva. Aprendé a usar useState, manejar eventos de inputs y renderizado condicional en React.',
    etiquetas: ['React', 'useState', 'Eventos'],
    modulo: '05',
  },
  {
    id: 'memorama',
    titulo: 'Memorama',
    descripcion: 'Juego de memoria: encontrá los 8 pares de cartas. Practicá estado, arrays y timers en React.',
    etiquetas: ['React', 'useState', 'setTimeout', 'Array.map'],
    modulo: '05',
  },
  {
    id: 'gestor-tareas',
    titulo: 'Gestor de Tareas',
    descripcion: 'CRUD completo: creá, editá, completá y eliminá tareas. Persistencia con localStorage.',
    etiquetas: ['CRUD', 'localStorage', 'useEffect', 'Filtros'],
    modulo: '05',
  },
  {
    id: 'pokedex',
    titulo: 'Pokédex',
    descripcion: 'Buscá cualquier pokémon por nombre o número usando la PokéAPI. Practicá fetch, async/await y manejo de estados de carga.',
    etiquetas: ['fetch', 'async/await', 'try/catch', 'Estados UI'],
    modulo: '04',
  },
]

function AppsIndex() {
  return (
    <div className="apps-index">
      <div className="apps-index__header">
        <h1>Aplicaciones de Práctica</h1>
        <p>
          Mini-aplicaciones aisladas para practicar los conceptos de cada módulo.
          Cada una está en su propia carpeta dentro de <code>src/apps/</code>.
        </p>
      </div>

      <div className="apps-index__grilla">
        {apps.map((app) => (
          <Link key={app.id} to={`/apps/${app.id}`} className="app-card">
            <div className="app-card__modulo">Módulo {app.modulo}</div>
            <h2 className="app-card__titulo">{app.titulo}</h2>
            <p className="app-card__descripcion">{app.descripcion}</p>
            <div className="app-card__etiquetas">
              {app.etiquetas.map((e) => (
                <span key={e} className="app-card__etiqueta">{e}</span>
              ))}
            </div>
            <span className="app-card__ir">Ver aplicación →</span>
          </Link>
        ))}

        {/* Placeholder para apps futuras */}
        <div className="app-card app-card--proximamente">
          <div className="app-card__modulo">Próximamente</div>
          <h2 className="app-card__titulo">Más apps en camino...</h2>
          <p className="app-card__descripcion">
            Se irán sumando nuevas aplicaciones a medida que avancemos en el curso.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AppsIndex
