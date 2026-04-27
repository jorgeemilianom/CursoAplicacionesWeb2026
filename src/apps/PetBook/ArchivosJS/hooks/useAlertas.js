import { useContext } from 'react'
import { AlertasContext } from '../../ArchivosJSX/context/AlertasContext'

export function useAlertas() {
  const context = useContext(AlertasContext)

  return (
    context || {
      alertas: [],
      alertasNoLeidas: [],
      cantidadNoLeidas: 0,
      alertasAltas: [],
      loading: false,
      error: '',
      agregarAlerta: () => {},
      marcarLeida: () => {},
      marcarTodasLeidas: () => {},
      descartarAlerta: () => {},
      limpiarAlertas: () => {},
      chequearVencimientos: async () => [],
    }
  )
}
