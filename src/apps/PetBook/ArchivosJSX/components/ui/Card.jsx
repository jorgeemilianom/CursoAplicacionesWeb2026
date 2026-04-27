function Card({ title, subtitle, children, actions, className = '' }) {
  return (
    <article className={`petbook-card ${className}`}>
      {(title || subtitle || actions) && (
        <header className="petbook-card__header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="petbook-card__content">{children}</div>
    </article>
  )
}

export default Card
