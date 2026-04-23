# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite, hot reload)
npm run build    # Production build
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

No test suite is configured in this project.

## Architecture

This is a React + Vite SPA called **"eprenda"** — an educational platform for a web development course. The app has three main sections: a landing page, a mini-apps gallery, and a docs/theory library.

### Routing (`src/App.jsx`)

All routes are declared in `App.jsx` using React Router v7. The shell layout (`Navbar` + `Footer`) wraps all routes. Route groups:

- `/` — Landing page
- `/apps` — Gallery index; `/apps/:id` — individual mini-app
- `/docs` — Docs index; `/docs/:slug` — individual doc or theory page

### Mini-apps (`src/apps/`)

Each app lives in its own isolated folder (`src/apps/<name>/`). To add a new app:
1. Create `src/apps/<name>/` with its component and CSS.
2. Register the route in `src/App.jsx`.
3. Add an entry object to the `apps` array in `src/pages/AppsIndex.jsx`.

If `app.disponible === false` in the `apps` array, the card renders as "Próximamente" (no link).

### Docs section (`src/pages/docs/` and `src/pages/teoria/`)

Doc pages are plain JSX files using shared CSS from `src/pages/docs/DocPage.css`. Each page wraps its content in `<div className="doc-page"><div className="doc-page__inner">` and uses `<div className="doc-section">` for sections.

To add a new doc page:
1. Create the JSX file in `src/pages/docs/` (or `teoria/`).
2. Add the route in `src/App.jsx`.
3. Add the entry to the `docs` or `teoria` array in `src/pages/DocsIndex.jsx`.

Doc card fields: `id`, `titulo`, `descripcion`, `etiquetas`, `tipo` (`instalacion` | `guia` | `referencia` | `teoria`), `icono` (emoji).

### Shared styles

- `src/index.css` — global resets and CSS variables (design tokens)
- `src/App.css` — site-shell layout (`.site-shell`, `.site-main`)
- `src/apps/apps-shared.css` — styles shared across mini-apps

### AI local (Docker)

The project includes `docker-compose.yml` at the root that runs:
- **Ollama** on port `11434` — local LLM engine
- **Open WebUI** on port `3000` — chat UI connected to Ollama

```bash
docker compose up -d    # Start both services
docker compose down     # Stop
docker exec -it ollama ollama pull llama3  # Download a model
```

See `docs/ollama-docker.md` for full usage instructions.
