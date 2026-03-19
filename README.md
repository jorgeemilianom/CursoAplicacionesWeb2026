# Curso de Aplicaciones Web Frontend 2026 — Eprenda

Landing page del curso y repositorio de aplicaciones de práctica.

## Tecnologías del proyecto

- [React 19](https://react.dev/) — biblioteca de UI
- [Vite 8](https://vite.dev/) — bundler y servidor de desarrollo
- [React Router v7](https://reactrouter.com/) — navegación entre páginas y apps

## Estructura del proyecto

```
src/
├── main.jsx              # Punto de entrada (monta BrowserRouter)
├── App.jsx               # Rutas principales
├── index.css             # Reset CSS y variables globales
├── App.css               # Estilos de la capa principal
│
├── components/           # Componentes reutilizables
│   ├── Navbar.jsx / .css
│   └── Footer.jsx / .css
│
├── pages/                # Páginas de la aplicación
│   ├── Landing.jsx / .css    → /
│   └── AppsIndex.jsx / .css  → /apps
│
└── apps/                 # Aplicaciones de práctica (una por carpeta)
    └── hola-mundo/
        ├── HolaMundo.jsx
        └── HolaMundo.css
```

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page del curso |
| `/apps` | Índice de todas las apps de práctica |
| `/apps/hola-mundo` | App 01 — Hola Mundo (useState, eventos) |

## Iniciar el servidor de desarrollo

```bash
npm run dev
```

## Agregar una nueva app de práctica

1. Crear la carpeta `src/apps/nombre-app/`
2. Crear el componente `NombreApp.jsx` y su `NombreApp.css`
3. Registrar la ruta en `src/App.jsx`:
   ```jsx
   import NombreApp from './apps/nombre-app/NombreApp.jsx'
   // ...
   <Route path="/apps/nombre-app" element={<NombreApp />} />
   ```
4. Agregar la app al array `apps` en `src/pages/AppsIndex.jsx`
