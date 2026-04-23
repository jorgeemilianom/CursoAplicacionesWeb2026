function Modal({ open, isOpen, onClose, title, children }) {
  const visible = open ?? isOpen

  if (!visible) return null

  return (
    <div className="petbook-modal" onClick={onClose} role="presentation">
      <div
        className="petbook-modal__panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="petbook-modal__header">
          {title && <h3>{title}</h3>}
          <button className="petbook-modal__close" type="button" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
