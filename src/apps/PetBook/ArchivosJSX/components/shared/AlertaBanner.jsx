import Button from '../ui/Button'

function AlertaBanner({ alerta, onRead }) {
  return (
    <div className={`petbook-banner ${alerta.leida ? 'petbook-banner--muted' : ''}`}>
      <div>
        <strong>{alerta.titulo}</strong>
        <p>{alerta.detalle}</p>
      </div>
      {!alerta.leida && (
        <Button variant="ghost" onClick={() => onRead(alerta.id)}>
          Marcar leida
        </Button>
      )}
    </div>
  )
}

export default AlertaBanner
