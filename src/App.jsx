import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import AppsIndex from './pages/AppsIndex.jsx'
import HolaMundo from './apps/hola-mundo/HolaMundo.jsx'
import Memorama from './apps/memorama/Memorama.jsx'
import GestorTareas from './apps/gestor-tareas/GestorTareas.jsx'

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
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
