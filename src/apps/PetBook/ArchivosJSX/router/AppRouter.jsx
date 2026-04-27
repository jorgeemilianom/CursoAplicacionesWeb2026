import { useState } from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { useAlertas } from '../../ArchivosJS/hooks/useAlertas'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import AlertaBanner from '../components/shared/AlertaBanner'
import Modal from '../components/ui/Modal'
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
import { PETBOOK_BASE_PATH } from '../../ArchivosJS/utils/constants'
import { formatearFechaCorta } from '../../ArchivosJS/utils/fechas'

function PrivateLayout() {
  const { alertas, alertasNoLeidas, marcarLeida, descartarAlerta, marcarTodasLeidas } = useAlertas()
  const [showAlertasModal, setShowAlertasModal] = useState(false)
  const alertaPrincipal = alertasNoLeidas[0] || alertas[0] || null

  return (
    <div className="petbook-shell">
      <Navbar />
      <div className="petbook-shell__body">
        <Sidebar />
        <div className="petbook-shell__content">
          {alertaPrincipal && (
            <section className="petbook-stack">
              <AlertaBanner
                alerta={alertaPrincipal}
                onRead={marcarLeida}
                onDismiss={descartarAlerta}
                onViewAll={() => setShowAlertasModal(true)}
              />
            </section>
          )}
          <Outlet />
        </div>
      </div>
      <Footer />

      <Modal isOpen={showAlertasModal} onClose={() => setShowAlertasModal(false)} title="Todas las alertas">
        <div className="petbook-stack">
          <div className="petbook-inline petbook-inline--stretch">
            <button type="button" className="petbook-link-button" onClick={marcarTodasLeidas}>
              Marcar todas como leidas
            </button>
          </div>
          {alertas.length === 0 ? (
            <p>No hay alertas activas.</p>
          ) : (
            <div className="petbook-notification-list">
              {alertas.map((alerta) => (
                <article key={alerta.id} className={`petbook-notification-item ${alerta.leida ? 'is-read' : ''}`}>
                  <div className="petbook-stack">
                    <strong>{alerta.mensaje}</strong>
                    <span>
                      {alerta.mascotaNombre} - {formatearFechaCorta(alerta.fecha)}
                    </span>
                  </div>
                  <div className="petbook-inline">
                    {!alerta.leida && (
                      <button type="button" className="petbook-link-button" onClick={() => marcarLeida(alerta.id)}>
                        Marcar leida
                      </button>
                    )}
                    <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}${alerta.destino || '/dashboard'}`}>
                      Ir al evento
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Modal>
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
