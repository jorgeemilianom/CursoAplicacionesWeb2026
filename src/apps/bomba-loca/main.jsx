import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GameProvider } from './GameContext.jsx' // 👉 IMPORTAMOS EL PROVEEDOR
import './App.css' // O el nombre que tenga tu archivo global de estilos

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👉 ENVOLVEMOS LA APP CON EL PROVEEDOR */}
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)