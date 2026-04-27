function Button({ children, variant = 'primary', type = 'button', ...props }) {
  return (
    <button type={type} className={`petbook-button petbook-button--${variant}`} {...props}>
      {children}
    </button>
  )
}

export default Button
