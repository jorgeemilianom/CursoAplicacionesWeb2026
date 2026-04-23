import { Outlet, Route, Routes } from 'react-router-dom'
import { useAlertas } from '../../ArchivosJS/hooks/useAlertas'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import AlertaBanner from '../components/shared/AlertaBanner'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Registro from '../pages/Registro'
import Dashboard from '../pages/Dashboard'
import MisMascotas from '../pages/MisMascotas'
import FichaMascota from '../pages/FichaMascota'
import NuevaMascota from '../pages/NuevaMascota'
import Vacunas from '../pages/Vacunas'
import Calendario from '../pages/Calendario'
import Gestacion from '../pages/Gestacion'
import DiarioSalud from '../pages/DiarioSalud'
import Veterinarias from '../pages/Veterinarias'
import AsistenteIA from '../pages/AsistenteIA'
import Configuracion from '../pages/Configuracion'
import NotFound from '../pages/NotFound'
import PrivateRoute from './PrivateRoute'

function PrivateLayout() {
  const { alertas, marcarLeida } = useAlertas()

  return (
    <div className="petbook-shell">
      <Navbar />
      <div className="petbook-shell__body">
        <Sidebar />
        <div className="petbook-shell__content">
          {alertas.length > 0 && (
            <section className="petbook-stack">
              {alertas.slice(0, 3).map((alerta) => (
                <AlertaBanner key={alerta.id} alerta={alerta} onRead={marcarLeida} />
              ))}
            </section>
          )}
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

function PublicLayout() {
  return (
    <div className="petbook-shell petbook-shell--public">
      <Navbar />
      <div className="petbook-shell__content petbook-shell__content--public">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="mascotas" element={<MisMascotas />} />
          <Route path="mascotas/nueva" element={<NuevaMascota />} />
          <Route path="mascotas/:id" element={<FichaMascota />} />
          <Route path="vacunas/:mascotaId" element={<Vacunas />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="gestacion/:mascotaId" element={<Gestacion />} />
          <Route path="diario/:mascotaId" element={<DiarioSalud />} />
          <Route path="veterinarias" element={<Veterinarias />} />
          <Route path="asistente" element={<AsistenteIA />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
