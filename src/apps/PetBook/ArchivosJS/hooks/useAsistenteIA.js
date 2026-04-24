import { useEffect, useRef, useState } from 'react'
import { asistenteDisponible, construirDatosMascotaIA, consultarAsistenteIA } from '../api/externalApis'

function buildWelcomeMessage(mascota) {
  return {
    role: 'assistant',
    content: mascota
      ? `Hola. Soy el asistente de PetBook y puedo orientarte con preguntas sobre ${mascota.nombre}.`
      : 'Hola. Soy el asistente de PetBook. Selecciona una mascota para comenzar.',
  }
}

export function useAsistenteIA(mascota) {
  const [mensajes, setMensajes] = useState([buildWelcomeMessage(mascota)])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    setMensajes([buildWelcomeMessage(mascota)])
  }, [mascota?.id])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, loading])

  async function enviarMensaje(texto) {
    if (!texto.trim() || !mascota) return

    const mensajeUsuario = { role: 'user', content: texto.trim() }
    const historialParaApi = mensajes.map((mensaje) => ({
      role: mensaje.role,
      content: mensaje.content,
    }))

    setMensajes((prev) => [...prev, mensajeUsuario])
    setLoading(true)

    try {
      const respuesta = await consultarAsistenteIA(texto.trim(), construirDatosMascotaIA(mascota), historialParaApi)
      setMensajes((prev) => [...prev, { role: 'assistant', content: respuesta }])
    } catch (err) {
      setMensajes((prev) => [...prev, { role: 'assistant', content: err.message }])
    } finally {
      setLoading(false)
    }
  }

  function limpiarChat() {
    setMensajes([buildWelcomeMessage(mascota)])
  }

  return {
    mensajes,
    loading,
    enviarMensaje,
    limpiarChat,
    disponible: asistenteDisponible(),
    scrollRef,
  }
}
