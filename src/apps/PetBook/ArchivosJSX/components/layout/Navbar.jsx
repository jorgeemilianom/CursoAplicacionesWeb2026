import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import ProBadge from '../ui/ProBadge'
import { useAlertas } from '../../../ArchivosJS/hooks/useAlertas'
import { useUser } from '../../../ArchivosJS/hooks/useUser'
import { PETBOOK_BASE_PATH } from '../../../ArchivosJS/utils/constants'
import { formatearFechaCorta } from '../../../ArchivosJS/utils/fechas'

function Navbar() {
  const { user, isAuthenticated, logout } = useUser()
  const { alertas, cantidadNoLeidas, marcarLeida, marcarTodasLeidas } = useAlertas()
  const [openNotifications, setOpenNotifications] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)

  return (
    <header className="petbook-topbar">
      <Link className="petbook-brand" to={PETBOOK_BASE_PATH}>
        <span>PetBook</span>
        <small>Agenda digital</small>
      </Link>
      <div className="petbook-topbar__actions">
        {isAuthenticated ? (
          <>
            <div className="petbook-notifications">
              <button
                className="petbook-notification-trigger"
                type="button"
                onClick={() => setOpenNotifications((prev) => !prev)}
                aria-expanded={openNotifications}
                aria-label="Abrir notificaciones"
              >
                Campana
                {cantidadNoLeidas > 0 && <span className="petbook-notification-count">{cantidadNoLeidas}</span>}
              </button>

              {openNotifications && (
                <div className="petbook-notification-panel">
                  <div className="petbook-notification-panel__header">
                    <strong>Notificaciones</strong>
                    <button type="button" className="petbook-link-button" onClick={marcarTodasLeidas}>
                      Marcar todas
                    </button>
                  </div>

                  {alertas.length === 0 ? (
                    <p className="petbook-notification-empty">No hay alertas activas.</p>
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
              )}
            </div>

            <span className="petbook-user-chip">{user?.nombre}</span>
            <div className="petbook-user-menu">
              <button
                className="petbook-user-menu__trigger"
                type="button"
                onClick={() => setOpenUserMenu((prev) => !prev)}
                aria-expanded={openUserMenu}
                aria-label="Menú de usuario"
              >
                <span className="petbook-user-avatar">{user?.nombre?.[0]?.toUpperCase() || 'U'}</span>
                <span className="petbook-user-menu__arrow">▼</span>
              </button>

              {openUserMenu && (
                <div className="petbook-user-menu__dropdown">
                  <Link
                    className="petbook-user-menu__item"
                    to={`${PETBOOK_BASE_PATH}/configuracion`}
                    onClick={() => setOpenUserMenu(false)}
                  >
                    👤 Mi perfil
                  </Link>
                  <Link
                    className="petbook-user-menu__item"
                    to={`${PETBOOK_BASE_PATH}/configuracion`}
                    onClick={() => setOpenUserMenu(false)}
                  >
                    ⚙️ Configuración
                  </Link>
                  <button
                    className="petbook-user-menu__item petbook-user-menu__item--pro"
                    type="button"
                    onClick={() => setOpenUserMenu(false)}
                  >
                    💎 Conocer plan Pro <ProBadge />
                  </button>
                  <hr className="petbook-user-menu__divider" />
                  <button
                    className="petbook-user-menu__item"
                    type="button"
                    onClick={() => {
                      logout()
                      setOpenUserMenu(false)
                    }}
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/login`}>
              Iniciar sesion
            </Link>
            <Link className="petbook-link" to={`${PETBOOK_BASE_PATH}/registro`}>
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
