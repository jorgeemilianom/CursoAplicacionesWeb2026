import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import AppsIndex from './pages/AppsIndex'
import HolaMundo from './apps/hola-mundo/HolaMundo'
import Memorama from './apps/memorama/Memorama'
import GestorTareas from './apps/gestor-tareas/GestorTareas'
import SopaDeLetras from './apps/sopa-de-letras/SopaDeLetras'
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
          <Route path="/apps/sopa-de-letras" element={<SopaDeLetras />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
