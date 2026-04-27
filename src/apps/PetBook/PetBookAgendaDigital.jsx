import AppRouter from './ArchivosJSX/router/AppRouter'
import { UserProvider } from './ArchivosJSX/context/UserContext'
import { MascotaProvider } from './ArchivosJSX/context/MascotaContext'
import { AlertasProvider } from './ArchivosJSX/context/AlertasContext'
import './PetBookAgendaDigital.css'

function PetBookAgendaDigital() {
  return (
    <UserProvider>
      <MascotaProvider>
        <AlertasProvider>
          <AppRouter />
        </AlertasProvider>
      </MascotaProvider>
    </UserProvider>
  )
}

export default PetBookAgendaDigital
