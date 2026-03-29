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
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
