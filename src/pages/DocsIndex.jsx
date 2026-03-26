import { Link } from 'react-router-dom'
import './DocsIndex.css'

const docs = [
  {
    id: 'instalar-ollama',
    titulo: 'Instalar Ollama (IA Local)',
    descripcion: 'Ejecutá modelos de IA como Llama 3, Mistral y Gemma directamente en tu computadora, sin internet ni API keys.',
    etiquetas: ['IA', 'LLM', 'Local', 'CLI'],
    tipo: 'instalacion',
    icono: '🦙',
  },
  {
    id: 'instalar-node',
    titulo: 'Instalar Node.js y npm',
    descripcion: 'Configurá Node.js, npm y nvm en Windows, macOS y Linux. Gestión de versiones incluida.',
    etiquetas: ['Node.js', 'npm', 'nvm', 'JavaScript'],
    tipo: 'instalacion',
    icono: '🟢',
  },
  {
    id: 'instalar-git',
    titulo: 'Instalar y Configurar Git',
    descripcion: 'Instalá Git, configurá tu identidad, generá una clave SSH y conectate a GitHub.',
    etiquetas: ['Git', 'GitHub', 'SSH', 'Control de versiones'],
    tipo: 'instalacion',
    icono: '🔀',
  },
  {
    id: 'vscode-setup',
    titulo: 'VS Code para Desarrollo Web',
    descripcion: 'Las mejores extensiones, atajos de teclado y configuraciones para tener un entorno profesional.',
    etiquetas: ['VS Code', 'Editor', 'Extensiones', 'Productividad'],
    tipo: 'guia',
    icono: '💙',
  },
  {
    id: 'git-cheatsheet',
    titulo: 'Git Cheatsheet',
    descripcion: 'Los comandos de Git más usados en el día a día, organizados por situación.',
    etiquetas: ['Git', 'Referencia rápida', 'Comandos'],
    tipo: 'referencia',
    icono: '📋',
  },
  {
    id: 'react-hooks',
    titulo: 'React Hooks Esenciales',
    descripcion: 'Referencia rápida de useState, useEffect, useRef y más. Con ejemplos prácticos.',
    etiquetas: ['React', 'Hooks', 'useState', 'useEffect'],
    tipo: 'referencia',
    icono: '⚛️',
  },
]

const tipoLabel = {
  instalacion: 'Instalación',
  guia: 'Guía',
  referencia: 'Referencia',
}

function DocsIndex() {
  return (
    <div className="docs-index">
      <div className="docs-index__header">
        <span className="docs-index__badge">Documentación</span>
        <h1>Guías y Referencias</h1>
        <p>
          Instalaciones paso a paso, guías de configuración y referencias rápidas para tu entorno de desarrollo.
        </p>
      </div>

      <div className="docs-index__grilla">
        {docs.map((doc) => (
          <Link key={doc.id} to={`/docs/${doc.id}`} className="doc-card">
            <div className="doc-card__top">
              <span className="doc-card__icono">{doc.icono}</span>
              <span className={`doc-card__tipo doc-card__tipo--${doc.tipo}`}>
                {tipoLabel[doc.tipo]}
              </span>
            </div>
            <h2 className="doc-card__titulo">{doc.titulo}</h2>
            <p className="doc-card__descripcion">{doc.descripcion}</p>
            <div className="doc-card__etiquetas">
              {doc.etiquetas.map((e) => (
                <span key={e} className="doc-card__etiqueta">{e}</span>
              ))}
            </div>
            <span className="doc-card__ir">Leer guía →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DocsIndex
