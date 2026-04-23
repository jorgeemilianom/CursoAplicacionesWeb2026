import { useContext } from 'react'
import { UserContext } from '../../ArchivosJSX/context/UserContext'

export function useUser() {
  return useContext(UserContext)
}
