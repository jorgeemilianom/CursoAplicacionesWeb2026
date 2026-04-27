import Card from '../ui/Card'

function PagePlaceholder({ title, description, extra }) {
  return (
    <section className="petbook-page">
      <Card title={title} subtitle="Etapa 1">
        <p>{description}</p>
        {extra}
      </Card>
    </section>
  )
}

export default PagePlaceholder
