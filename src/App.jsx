import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import AppsIndex from './pages/AppsIndex.jsx'
import HolaMundo from './apps/hola-mundo/HolaMundo.jsx'
import Memorama from './apps/memorama/Memorama.jsx'
import GestorTareas from './apps/gestor-tareas/GestorTareas.jsx'
import ScapeRoom from './apps/scape-room/ScapeRoom.jsx'
import Pokedex from './apps/pokedex/Pokedex.jsx'
import DocsIndex from './pages/DocsIndex.jsx'
import InstallarOllama from './pages/docs/InstallarOllama.jsx'
import InstallarNode from './pages/docs/InstallarNode.jsx'
import InstallarGit from './pages/docs/InstallarGit.jsx'
import VSCodeSetup from './pages/docs/VSCodeSetup.jsx'
import GitCheatsheet from './pages/docs/GitCheatsheet.jsx'
import ReactHooks from './pages/docs/ReactHooks.jsx'
import TeoriaHTML from './pages/teoria/TeoriaHTML.jsx'
import TeoriaCSS from './pages/teoria/TeoriaCSS.jsx'
import TeoriaJavaScript from './pages/teoria/TeoriaJavaScript.jsx'
import TeoriaJSAvanzado from './pages/teoria/TeoriaJSAvanzado.jsx'
import TeoriaReact from './pages/teoria/TeoriaReact.jsx'
import TeoriaVueJS from './pages/teoria/TeoriaVueJS.jsx'
import TeoriaTypeScript from './pages/teoria/TeoriaTypeScript.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/apps" element={<AppsIndex />} />
          <Route path="/apps/hola-mundo" element={<HolaMundo />} />
          <Route path="/apps/memorama" element={<Memorama />} />
          <Route path="/apps/gestor-tareas" element={<GestorTareas />} />
          <Route path="/apps/scape-room" element={<ScapeRoom />} />
          <Route path="/apps/pokedex" element={<Pokedex />} />
          <Route path="/docs" element={<DocsIndex />} />
          <Route path="/docs/instalar-ollama" element={<InstallarOllama />} />
          <Route path="/docs/instalar-node" element={<InstallarNode />} />
          <Route path="/docs/instalar-git" element={<InstallarGit />} />
          <Route path="/docs/vscode-setup" element={<VSCodeSetup />} />
          <Route path="/docs/git-cheatsheet" element={<GitCheatsheet />} />
          <Route path="/docs/react-hooks" element={<ReactHooks />} />
          <Route path="/docs/teoria-html" element={<TeoriaHTML />} />
          <Route path="/docs/teoria-css" element={<TeoriaCSS />} />
          <Route path="/docs/teoria-javascript" element={<TeoriaJavaScript />} />
          <Route path="/docs/teoria-js-avanzado" element={<TeoriaJSAvanzado />} />
          <Route path="/docs/teoria-react" element={<TeoriaReact />} />
          <Route path="/docs/teoria-vuejs" element={<TeoriaVueJS />} />
          <Route path="/docs/teoria-typescript" element={<TeoriaTypeScript />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
