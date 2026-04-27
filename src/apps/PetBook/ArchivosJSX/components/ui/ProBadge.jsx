import './ProBadge.css'

const ProBadge = ({ texto = "PRO" }) => (
  <span className="pro-badge">
    ✨ {texto}
  </span>
)

export default ProBadge