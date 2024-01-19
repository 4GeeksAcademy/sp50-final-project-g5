
import React, { useEffect } from 'react';

export const Maps = () => {
  useEffect(() => {
    const apiKey = 'tu_clave_api';
    const location = '40.392163,-3.6978677';
    const radius = 500;
    const types = 'pharmacy';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&types=${types}&key=${apiKey}`;

    // Realizar la solicitud fetch
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Manejar la respuesta JSON
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // El segundo argumento del useEffect es un array de dependencias, en este caso, vacío para que se ejecute solo una vez

  return (
    <div>
      {/* Contenido de tu componente */}
    </div>
  );
};

