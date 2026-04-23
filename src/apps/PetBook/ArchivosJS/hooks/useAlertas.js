import { useContext } from 'react'
import { AlertasContext } from '../../ArchivosJSX/context/AlertasContext'

export function useAlertas() {
  return useContext(AlertasContext)
}
