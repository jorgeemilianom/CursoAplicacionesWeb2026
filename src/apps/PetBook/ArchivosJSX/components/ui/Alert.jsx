function Alert({ children, tone = 'info' }) {
  return <div className={`petbook-alert petbook-alert--${tone}`}>{children}</div>
}

export default Alert
