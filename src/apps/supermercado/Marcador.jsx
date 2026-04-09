import React from 'react';

const Marcador = ({ puntos, mensaje }) => {
  return (
    <div style={estilos.contenedor}>
      <div style={estilos.puntos}>
        ⭐ Puntos: {puntos}
      </div>
      <div style={{
        ...estilos.mensaje, 
        color: mensaje.includes('¡Muy bien!') ? '#2ECC40' : '#FF4136'
      }}>
        {mensaje}
      </div>
    </div>
  );
};

const estilos = {
  contenedor: { marginBottom: '20px' },
  puntos: { fontSize: '2rem', fontWeight: 'bold', color: '#FF851B' },
  mensaje: { fontSize: '1.5rem', marginTop: '10px', height: '30px' }
};

export default Marcador;
