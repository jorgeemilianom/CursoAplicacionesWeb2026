import { useState } from 'react'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ProBadge from '../components/ui/ProBadge'
import { useAsistenteIA } from '../../ArchivosJS/hooks/useAsistenteIA'
import { useMascota } from '../../ArchivosJS/hooks/useMascota'

const quickPrompts = [
  'Que puedo darle de comer?',
  'Cuando deberia vacunarlo?',
  'Es normal este comportamiento?',
]

function AsistenteIA() {
  const { mascotas, mascotaActiva, seleccionarMascota } = useMascota()
  const [texto, setTexto] = useState('')
  const [modoAsistente, setModoAsistente] = useState('basico')
  const { mensajes, loading, enviarMensaje, limpiarChat, disponible, scrollRef } = useAsistenteIA(mascotaActiva)

  async function handleSubmit(event) {
    event.preventDefault()
    await enviarMensaje(texto)
    setTexto('')
  }

  return (
    <section className="petbook-page">
      <Card title="Asistente de salud" subtitle="PetBook AI">
        <div className="petbook-stack">
          <Alert tone="info">
            Este asistente es orientativo y no reemplaza la consulta con un veterinario profesional.
          </Alert>

          <label>
            Selecciona tu mascota
            <select value={mascotaActiva?.id || ''} onChange={(event) => seleccionarMascota(event.target.value)}>
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="petbook-assistant-mode">
            <span>Modo: </span>
            <label className="petbook-toggle-inline">
              <input
                type="radio"
                name="modoAsistente"
                value="basico"
                checked={modoAsistente === 'basico'}
                onChange={(e) => setModoAsistente(e.target.value)}
              />
              Básico (claude-haiku)
            </label>
            <label className="petbook-toggle-inline">
              <input
                type="radio"
                name="modoAsistente"
                value="pro"
                checked={modoAsistente === 'pro'}
                onChange={(e) => setModoAsistente(e.target.value)}
                disabled
              />
              Pro (claude-opus) <ProBadge />
            </label>
          </div>

          <p className="petbook-text-small">
            Básico → Respuestas rápidas<br />
            Pro → Análisis más profundo, historial clínico completo ✨ Plan Pro
          </p>

          {!disponible && (
            <Alert tone="info">
              Funcion disponible proximamente. Configura la API key de Anthropic para habilitar el chat real.
            </Alert>
          )}

          <div className="petbook-chat">
            {mensajes.map((mensaje, index) => (
              <article key={`${mensaje.role}-${index}`} className={`petbook-chat__message petbook-chat__message--${mensaje.role}`}>
                <strong>{mensaje.role === 'assistant' ? 'PetBook AI' : 'Tu'}</strong>
                <p>{mensaje.content}</p>
              </article>
            ))}
            {loading && <div className="petbook-loader">Pensando respuesta...</div>}
            <div ref={scrollRef} />
          </div>

          <form className="petbook-inline petbook-inline--stretch" onSubmit={handleSubmit}>
            <input
              className="petbook-chat__input"
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Escribe tu consulta aqui..."
            />
            <Button type="submit" disabled={!disponible || loading || !mascotaActiva}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={limpiarChat}>
              Limpiar
            </Button>
          </form>

          <div className="petbook-inline">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" className="petbook-tab" onClick={() => setTexto(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </section>
  )
}

export default AsistenteIA
