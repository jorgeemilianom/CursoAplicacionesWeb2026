import React from 'react';

const Producto = ({ emoji, nombre }) => {
  return (
    <div style={estilos.producto}>
      <span style={estilos.emoji}>{emoji}</span>
      <p style={estilos.texto}>{nombre}</p>
    </div>
  );
};

const estilos = {
  producto: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'bounce 2s infinite' // Podrías agregar un keyframe en CSS luego
  },
  emoji: { fontSize: '80px', margin: 0 },
  texto: { fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }
};

export default Producto;
