import React, { useState, useContext } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { MapContext } from './Layout';
import { Box, Paper, Typography, Alert } from '@mui/material';

const containerStyle = { width: '100%', height: '500px' };
const uasMazatlan = { lat: 23.2440, lng: -106.4270 };
const plazuelaMachado = { lat: 23.1975, lng: -106.4255 };
const mapDarkStyle = [ { elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }, ];


function MapComponent() {
  const { isLoaded } = useContext(MapContext);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [error, setError] = useState(null);

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirectionsResponse(response);
        setError(null);
      } else {
        console.error('Directions request failed due to ' + response.status);
        setError('Error al calcular la ruta: ' + response.status);
      }
    }
  };

  if (!isLoaded) return null;

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      {error && <Alert severity="error" sx={{mb:1}}>{error}</Alert>}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={uasMazatlan}
        zoom={13}
        options={{ styles: mapDarkStyle }}
      >
        <DirectionsService
          options={{
            destination: plazuelaMachado,
            origin: uasMazatlan,
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
        {directionsResponse && (
          <DirectionsRenderer options={{ directions: directionsResponse }} />
        )}
        {!directionsResponse && (
            <>
              <Marker position={uasMazatlan} label={{text: "UAS", color: "white", fontWeight: "bold"}} />
              <Marker position={plazuelaMachado} label={{text: "Machado", color: "white", fontWeight: "bold"}} />
            </>
        )}
      </GoogleMap>
       {directionsResponse && directionsResponse.routes[0]?.legs[0] && (
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1">Distancia: {directionsResponse.routes[0].legs[0].distance.text}</Typography>
          <Typography variant="subtitle1">Duración Estimada: {directionsResponse.routes[0].legs[0].duration.text}</Typography>
        </Box>
      )}
    </Paper>
  );
}

function RutaDosPuntos() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: "#FF3131", fontFamily: "Montserrat, sans-serif"}}>
              Ruta con dos puntos
            </Typography>
            <Box minWidth="600px">
              <MapComponent />
            </Box>
    </Box>
  );
}

export default RutaDosPuntos;
