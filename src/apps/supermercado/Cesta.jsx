import React from 'react';

// Recibimos las props: 
// - color: para saber qué color representa
// - alHacerClic: la función que avisará al padre
// - nombre: opcional, por si quieres poner el texto "Roja", "Verde", etc.
const Cesta = ({ color, alHacerClic, nombre }) => {
  
  // Mapeo de colores de texto a códigos hexadecimales para el estilo
  const coloresHex = {
    rojo: '#FF4136',
    amarillo: '#FFDC00',
    morado: '#B10DC9',
    verde: '#2ECC40',
    azul: '#0074D9'
  };

  const estiloCesta = {
    backgroundColor: coloresHex[color] || '#ccc',
    width: '120px',
    height: '100px',
    borderRadius: '0 0 20px 20px', // Forma de canasta
    border: '4px solid rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: color === 'amarillo' ? 'black' : 'white', // Contraste para el amarillo
    transition: 'transform 0.2s', // Animación suave al pasar el mouse
  };

  return (
    <div 
      style={estiloCesta} 
      onClick={() => alHacerClic(color)}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      {nombre.toUpperCase()}
    </div>
  );
};

export default Cesta;
