import { Routes, Route, Link, NavLink, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import './ReactRouterDemo.css'

/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  App 08 — React Router y Navegación                             ║
  ║                                                                  ║
  ║  CONCEPTOS:                                                      ║
  ║  • Routes / Route    — define el mapa de rutas                  ║
  ║  • Link              — navegación declarativa (sin reload)      ║
  ║  • NavLink           — Link con clase activa automática         ║
  ║  • useNavigate       — navegación programática desde JS         ║
  ║  • useParams         — lee parámetros dinámicos (:id)           ║
  ║  • useSearchParams   — lee/escribe query strings (?filtro=x)    ║
  ║  • Ruta 404          — wildcard * captura rutas no definidas    ║
  ╚══════════════════════════════════════════════════════════════════╝

  ESTRUCTURA DE RUTAS DE ESTA APP:
  ─────────────────────────────────────────────────────────────────
    /apps/react-router-demo/             → PaginaInicio
    /apps/react-router-demo/destinos     → PaginaDestinos  (useSearchParams)
    /apps/react-router-demo/destinos/:id → PaginaDetalle   (useParams)
    /apps/react-router-demo/*            → PaginaNoEncontrada (404)
*/

// ─────────────────────────────────────────────────────────────────
// DATOS — catálogo de destinos (sin API, todo en memoria)
// ─────────────────────────────────────────────────────────────────
const DESTINOS = [
  {
    id: 'paris',
    nombre: 'París',
    pais: 'Francia',
    continente: 'Europa',
    emoji: '🗼',
    descripcion: 'La Ciudad de la Luz. Hogar del Louvre, la Torre Eiffel y la mejor baguette del mundo. París es el referente mundial del arte, la moda y la gastronomía.',
    moneda: 'Euro (€)',
    idioma: 'Francés',
    imperdible: 'Torre Eiffel',
  },
  {
    id: 'tokio',
    nombre: 'Tokio',
    pais: 'Japón',
    continente: 'Asia',
    emoji: '⛩️',
    descripcion: 'La megaciudad del futuro y el pasado. Rascacielos neón, templos milenarios, sushi de mercado y la cultura del anime en su máxima expresión.',
    moneda: 'Yen (¥)',
    idioma: 'Japonés',
    imperdible: 'Barrio de Shibuya',
  },
  {
    id: 'nueva-york',
    nombre: 'Nueva York',
    pais: 'EE.UU.',
    continente: 'América',
    emoji: '🗽',
    descripcion: 'La ciudad que nunca duerme. Broadway, Central Park, Wall Street y la Estatua de la Libertad conviven en la metrópolis más icónica del mundo.',
    moneda: 'Dólar ($)',
    idioma: 'Inglés',
    imperdible: 'Central Park',
  },
  {
    id: 'rio',
    nombre: 'Río de Janeiro',
    pais: 'Brasil',
    continente: 'América',
    emoji: '🌊',
    descripcion: 'La Cidade Maravilhosa. Cristo Redentor, la playa de Copacabana, el carnaval más famoso del mundo y una energía que se siente en cada esquina.',
    moneda: 'Real (R$)',
    idioma: 'Portugués',
    imperdible: 'Cristo Redentor',
  },
  {
    id: 'sydney',
    nombre: 'Sídney',
    pais: 'Australia',
    continente: 'Oceanía',
    emoji: '🦘',
    descripcion: 'La joya de Oceanía. La Ópera y el Harbour Bridge se reflejan en una bahía espectacular. Playas, surf y una vida al aire libre sin igual.',
    moneda: 'Dólar australiano (A$)',
    idioma: 'Inglés',
    imperdible: 'Ópera de Sídney',
  },
  {
    id: 'marrakech',
    nombre: 'Marrakech',
    pais: 'Marruecos',
    continente: 'África',
    emoji: '🕌',
    descripcion: 'La Ciudad Roja del norte de África. Sus medinas laberínticas, la plaza Jemaa el-Fna y los colores de sus zocos sumergen al viajero en otra dimensión.',
    moneda: 'Dírham (MAD)',
    idioma: 'Árabe / Bereber',
    imperdible: 'Medina de Marrakech',
  },
  {
    id: 'roma',
    nombre: 'Roma',
    pais: 'Italia',
    continente: 'Europa',
    emoji: '🏛️',
    descripcion: 'La Ciudad Eterna. El Coliseo, el Vaticano, la Fontana di Trevi y dos mil años de historia conviven con la mejor pasta y el helado más cremoso.',
    moneda: 'Euro (€)',
    idioma: 'Italiano',
    imperdible: 'Coliseo Romano',
  },
  {
    id: 'bangkok',
    nombre: 'Bangkok',
    pais: 'Tailandia',
    continente: 'Asia',
    emoji: '🛕',
    descripcion: 'La ciudad de los templos dorados y el caos delicioso. El Templo del Buda Esmeralda, los mercados flotantes y el street food más sabroso de Asia.',
    moneda: 'Baht (฿)',
    idioma: 'Tailandés',
    imperdible: 'Templo Wat Phra Kaew',
  },
]

const CONTINENTES = ['todos', 'América', 'Europa', 'Asia', 'África', 'Oceanía']
const BASE = '/apps/react-router-demo'

// ─────────────────────────────────────────────────────────────────
// NAVEGACIÓN INTERNA — usa NavLink para mostrar la ruta activa
// ─────────────────────────────────────────────────────────────────
// NavLink recibe una función en className que recibe { isActive }.
// Cuando la URL coincide con `to`, isActive === true → clase activa.
// La prop `end` en el primer link evita que "/" matchee también "/destinos".
function NavInterna() {
  const getLinkClass = ({ isActive }) =>
    isActive ? 'rrd-nav__link rrd-nav__link--activo' : 'rrd-nav__link'

  return (
    <nav className="rrd-nav">
      {/* `end` asegura match exacto: sólo activo en /apps/react-router-demo/ */}
      <NavLink to={BASE} end className={getLinkClass}>
        🏠 Inicio
      </NavLink>
      <NavLink to={`${BASE}/destinos`} className={getLinkClass}>
        🌍 Destinos
      </NavLink>
      {/* Ruta inventada para demostrar el 404 */}
      <NavLink to={`${BASE}/inexistente`} className={getLinkClass}>
        💥 Ruta 404
      </NavLink>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────
// PÁGINA: INICIO
// ─────────────────────────────────────────────────────────────────
// Demuestra Link y useNavigate para navegar al hacer click en un botón.
function PaginaInicio() {
  // useNavigate devuelve una función para navegar desde código JS.
  // Útil cuando la navegación ocurre dentro de un handler (submit, click, etc.)
  const navigate = useNavigate()

  return (
    <div className="rrd-page rrd-page--inicio">
      <div className="rrd-page__badge">📍 Ruta: /apps/react-router-demo/</div>
      <h2>Bienvenido al Explorador de Destinos</h2>
      <p>
        Esta mini-app demuestra los conceptos clave de <strong>React Router</strong>.
        Explorá las rutas usando los botones de la barra de navegación o los de abajo.
      </p>

      <div className="rrd-inicio__grid">
        <div className="rrd-concepto-card">
          <span className="rrd-concepto-card__icono">🔗</span>
          <h3>Link</h3>
          <p>Navegación declarativa en JSX. Reemplaza al <code>&lt;a href&gt;</code> sin recargar la página.</p>
          {/* Link — el componente más básico para navegar */}
          <Link to={`${BASE}/destinos`} className="rrd-btn rrd-btn--primary">
            Ver destinos →
          </Link>
        </div>

        <div className="rrd-concepto-card">
          <span className="rrd-concepto-card__icono">🧭</span>
          <h3>NavLink</h3>
          <p>Igual que Link, pero agrega una clase CSS cuando la ruta coincide. Ideal para navbars.</p>
          <span className="rrd-badge-demo">← Mirá la barra de arriba</span>
        </div>

        <div className="rrd-concepto-card">
          <span className="rrd-concepto-card__icono">⚡</span>
          <h3>useNavigate</h3>
          <p>Navegación desde código JavaScript. Útil en handlers de formularios, callbacks, etc.</p>
          {/* useNavigate — navegación programática */}
          <button
            className="rrd-btn rrd-btn--secondary"
            onClick={() => navigate(`${BASE}/destinos`)}
          >
            navigate('destinos')
          </button>
        </div>

        <div className="rrd-concepto-card">
          <span className="rrd-concepto-card__icono">💥</span>
          <h3>Ruta 404</h3>
          <p>El wildcard <code>path="*"</code> captura cualquier ruta que no exista.</p>
          <button
            className="rrd-btn rrd-btn--danger"
            onClick={() => navigate(`${BASE}/ruta-que-no-existe`)}
          >
            Ir a ruta inválida
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PÁGINA: LISTA DE DESTINOS
// ─────────────────────────────────────────────────────────────────
// Demuestra useSearchParams para filtrar sin perder la URL.
// La URL queda así: /destinos?continente=Europa
function PaginaDestinos() {
  // useSearchParams devuelve [searchParams, setSearchParams]
  // searchParams.get('clave') → lee el query param
  // setSearchParams({ clave: 'valor' }) → actualiza la URL sin navegar
  const [searchParams, setSearchParams] = useSearchParams()

  const continente = searchParams.get('continente') || 'todos'

  const filtrados =
    continente === 'todos'
      ? DESTINOS
      : DESTINOS.filter((d) => d.continente === continente)

  return (
    <div className="rrd-page">
      <div className="rrd-page__badge">
        📍 Ruta: /destinos{continente !== 'todos' ? `?continente=${continente}` : ''}
      </div>
      <h2>Destinos del Mundo</h2>

      {/* Filtro por continente — modifica el query string de la URL */}
      <div className="rrd-filtros">
        <span className="rrd-filtros__label">Filtrar por continente:</span>
        <div className="rrd-filtros__botones">
          {CONTINENTES.map((c) => (
            <button
              key={c}
              // Al hacer click actualizamos el query param con setSearchParams
              onClick={() =>
                c === 'todos'
                  ? setSearchParams({})
                  : setSearchParams({ continente: c })
              }
              className={`rrd-filtro-btn ${continente === c ? 'rrd-filtro-btn--activo' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="rrd-grid">
        {filtrados.map((destino) => (
          <DestinoCard key={destino.id} destino={destino} />
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className="rrd-vacio">No hay destinos para este continente.</p>
      )}
    </div>
  )
}

// Tarjeta de destino — usa Link para navegar al detalle
function DestinoCard({ destino }) {
  return (
    // Link lleva a la ruta dinámica: /destinos/paris, /destinos/tokio, etc.
    <Link to={`${BASE}/destinos/${destino.id}`} className="rrd-card">
      <span className="rrd-card__emoji">{destino.emoji}</span>
      <div className="rrd-card__info">
        <h3>{destino.nombre}</h3>
        <p>{destino.pais} · {destino.continente}</p>
      </div>
      <span className="rrd-card__arrow">→</span>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────
// PÁGINA: DETALLE DE DESTINO
// ─────────────────────────────────────────────────────────────────
// Demuestra useParams para leer el :id de la URL.
// También usa useNavigate para el botón "Volver".
function PaginaDetalle() {
  // useParams devuelve un objeto con los parámetros dinámicos de la ruta.
  // Como la ruta es "destinos/:id", aquí obtenemos { id: 'paris' } etc.
  const { id } = useParams()
  const navigate = useNavigate()

  const destino = DESTINOS.find((d) => d.id === id)

  // Si el id no existe en nuestros datos → mostramos el 404
  if (!destino) {
    return <PaginaNoEncontrada />
  }

  return (
    <div className="rrd-page rrd-page--detalle">
      <div className="rrd-page__badge">
        📍 Ruta: /destinos/<strong>{id}</strong> — useParams() → {'{'} id: '{id}' {'}'}
      </div>

      {/* useNavigate(-1) navega a la página anterior del historial */}
      <button className="rrd-btn-volver" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="rrd-detalle">
        <div className="rrd-detalle__encabezado">
          <span className="rrd-detalle__emoji">{destino.emoji}</span>
          <div>
            <h2>{destino.nombre}</h2>
            <p className="rrd-detalle__pais">{destino.pais} · {destino.continente}</p>
          </div>
        </div>

        <p className="rrd-detalle__descripcion">{destino.descripcion}</p>

        <div className="rrd-detalle__datos">
          <div className="rrd-dato">
            <span className="rrd-dato__label">🗣️ Idioma</span>
            <span className="rrd-dato__valor">{destino.idioma}</span>
          </div>
          <div className="rrd-dato">
            <span className="rrd-dato__label">💰 Moneda</span>
            <span className="rrd-dato__valor">{destino.moneda}</span>
          </div>
          <div className="rrd-dato">
            <span className="rrd-dato__label">📸 No te pierdas</span>
            <span className="rrd-dato__valor">{destino.imperdible}</span>
          </div>
        </div>

        <div className="rrd-detalle__nav">
          <button className="rrd-btn rrd-btn--secondary" onClick={() => navigate(`${BASE}/destinos`)}>
            Ver todos los destinos
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PÁGINA: 404 — NOT FOUND
// ─────────────────────────────────────────────────────────────────
// Esta página se muestra cuando ninguna ruta coincide (path="*").
// También la usamos manualmente cuando un :id no existe en los datos.
function PaginaNoEncontrada() {
  const navigate = useNavigate()

  return (
    <div className="rrd-page rrd-page--404">
      <div className="rrd-page__badge">📍 Ruta: /* (wildcard — ninguna ruta coincidió)</div>
      <span className="rrd-404__numero">404</span>
      <h2>Página no encontrada</h2>
      <p>
        La ruta que ingresaste no existe. El <code>path="*"</code> capturó esta URL
        porque ninguna de las rutas definidas coincidió.
      </p>
      <div className="rrd-404__acciones">
        <button className="rrd-btn rrd-btn--primary" onClick={() => navigate(BASE)}>
          Volver al inicio
        </button>
        <button className="rrd-btn rrd-btn--secondary" onClick={() => navigate(-1)}>
          ← Página anterior
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────
// Aquí definimos las Routes anidadas dentro de la mini-app.
// El Route padre en App.jsx tiene path="/apps/react-router-demo/*"
// — el /* es CLAVE para que React Router permita subrutas internas.
function ReactRouterDemo() {
  return (
    <div className="rrd-shell">
      <div className="rrd-container">

        <Link to="/apps" className="rrd-volver-apps">← Volver a aplicaciones</Link>

        <header className="rrd-header">
          <span className="rrd-modulo">Semana 22 — React Router</span>
          <h1>React Router — Navegación</h1>
          <p>
            Mini-app con rutas anidadas, parámetros dinámicos, query strings y
            navegación programática. Explorá cada sección para ver los conceptos en acción.
          </p>
        </header>

        {/*
          El "navegador" interno: NavLink + Routes.
          Todo esto vive dentro del BrowserRouter que ya envuelve la app principal.
        */}
        <div className="rrd-demo">
          <NavInterna />
          <div className="rrd-contenido">
            <Routes>
              {/* index = ruta raíz exacta (/apps/react-router-demo/) */}
              <Route index element={<PaginaInicio />} />

              {/* Ruta estática: /apps/react-router-demo/destinos */}
              <Route path="destinos" element={<PaginaDestinos />} />

              {/* Ruta dinámica: :id es un parámetro variable */}
              <Route path="destinos/:id" element={<PaginaDetalle />} />

              {/* Wildcard: captura cualquier ruta no definida arriba */}
              <Route path="*" element={<PaginaNoEncontrada />} />
            </Routes>
          </div>
        </div>

        {/* ── Sección de conceptos ── */}
        <div className="rrd-conceptos">
          <h2>¿Qué conceptos practicamos acá?</h2>
          <ul>
            <li>
              <code>Routes / Route</code>
              <span>Define el mapa de rutas. Cada Route asocia un path con un componente.</span>
            </li>
            <li>
              <code>Link</code>
              <span>Navegación declarativa en JSX. Genera un &lt;a&gt; que no recarga la página.</span>
            </li>
            <li>
              <code>NavLink</code>
              <span>Como Link, pero recibe <code>{'({ isActive })'}</code> en className para aplicar estilos activos.</span>
            </li>
            <li>
              <code>useNavigate</code>
              <span>Navegar desde código JS: <code>navigate('/ruta')</code> o <code>navigate(-1)</code> para volver.</span>
            </li>
            <li>
              <code>useParams</code>
              <span>Lee los parámetros dinámicos de la URL. Ruta <code>:id</code> → <code>{'{ id }'}</code>.</span>
            </li>
            <li>
              <code>useSearchParams</code>
              <span>Lee y escribe query strings. <code>?continente=Europa</code> sin cambiar de página.</span>
            </li>
            <li>
              <span className="concepto-texto">Ruta 404</span>
              <span>El <code>path="*"</code> actúa como catch-all para rutas no definidas.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default ReactRouterDemo
