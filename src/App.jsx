import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import AppsIndex from './pages/AppsIndex'
import HolaMundo from './apps/hola-mundo/HolaMundo'
import Memorama from './apps/memorama/Memorama'
import GestorTareas from './apps/gestor-tareas/GestorTareas'
import ScapeRoom from './apps/scape-room/ScapeRoom'
import Pokedex from './apps/pokedex/Pokedex'
import SopaDeLetras from './apps/sopa-de-letras/SopaDeLetras'
import BombaLoca from './apps/bomba-loca/BombaLoca'
import JuegoSupermercado from './apps/supermercado/JuegoSupermercado'
import DocsIndex from './pages/DocsIndex'
import InstallarOllama from './pages/docs/InstallarOllama'
import InstallarNode from './pages/docs/InstallarNode'
import InstallarGit from './pages/docs/InstallarGit'
import VSCodeSetup from './pages/docs/VSCodeSetup'
import GitCheatsheet from './pages/docs/GitCheatsheet'
import ReactHooks from './pages/docs/ReactHooks'
import TeoriaHTML from './pages/teoria/TeoriaHTML'
import TeoriaCSS from './pages/teoria/TeoriaCSS'
import TeoriaJavaScript from './pages/teoria/TeoriaJavaScript'
import TeoriaJSAvanzado from './pages/teoria/TeoriaJSAvanzado'
import TeoriaReact from './pages/teoria/TeoriaReact'
import TeoriaVueJS from './pages/teoria/TeoriaVueJS'
import TeoriaTypeScript from './pages/teoria/TeoriaTypeScript'
import './App.css'

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/apps" element={<AppsIndex />} />
          <Route path="/apps/hola-mundo" element={<HolaMundo />} />
          <Route path="/apps/memorama" element={<Memorama />} />
          <Route path="/apps/gestor-tareas" element={<GestorTareas />} />
          <Route path="/apps/scape-room" element={<ScapeRoom />} />
          <Route path="/apps/pokedex" element={<Pokedex />} />
          <Route path="/apps/supermercado-de-colores" element={<JuegoSupermercado />} />
          <Route path="/apps/sopa-de-letras" element={<SopaDeLetras />} />
          <Route path="/apps/bomba-loca" element={<BombaLoca />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
