import Badge from '../ui/Badge'
import Button from '../ui/Button'

function AlertaBanner({ alerta, onRead, onViewAll, onDismiss }) {
  return (
    <div
      className={`petbook-banner petbook-banner--priority-${alerta.prioridad || 'baja'} ${alerta.leida ? 'petbook-banner--muted' : ''}`}
    >
      <div className="petbook-stack">
        <div className="petbook-inline">
          <Badge tone={alerta.prioridad === 'alta' ? 'danger' : alerta.prioridad === 'media' ? 'warning' : 'info'}>
            {alerta.prioridad || 'baja'}
          </Badge>
          <strong>{alerta.mascotaNombre}</strong>
        </div>
        <div>
          <strong>{alerta.mensaje}</strong>
          <p>{alerta.fecha}</p>
        </div>
      </div>
      <div className="petbook-inline petbook-inline--stretch">
        {onViewAll && (
          <Button variant="secondary" onClick={onViewAll}>
            Ver todas
          </Button>
        )}
        {!alerta.leida && (
          <Button variant="ghost" onClick={() => onRead(alerta.id)}>
            Marcar leida
          </Button>
        )}
        {onDismiss && (
          <button className="petbook-icon-button" type="button" onClick={() => onDismiss(alerta.id)} aria-label="Descartar alerta">
            X
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertaBanner
