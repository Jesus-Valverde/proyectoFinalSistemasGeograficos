import React, { useState, useContext } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { MapContext } from './Layout';
import { Box, Paper, Typography, Button } from '@mui/material';

const containerStyle = { width: '100%', height: '500px' };
const center = { lat: 23.249426, lng: -106.410063 };
const markerPosition = { lat: 23.249426, lng: -106.410063 };
const markerInfo = {
  title: '¡Hola desde Mazatlán!',
  content: 'Este es un hermoso puerto en el Pacífico Mexicano.'
};
const mapDarkStyle = [{ elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },];


function MapComponent() {
  const { isLoaded, loadError } = useContext(MapContext);
  const [activeMarker, setActiveMarker] = useState(null);

  const handleMarkerClick = (marker) => {
    setActiveMarker(activeMarker === marker ? null : marker);
  };

  if (loadError) {
    return <Typography color="error" sx={{ p: 2 }}>Error al cargar Google Maps desde Layout: {loadError.message}</Typography>;
  }

  if (!isLoaded) return <Typography sx={{ p: 2 }}>Cargando mapa...</Typography>;

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden', backgroundColor: 'transparent' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{ styles: mapDarkStyle }}
      >
        <Marker
          position={markerPosition}
          title={markerInfo.title}
          onClick={() => handleMarkerClick(markerPosition)}
        />
        {activeMarker && activeMarker.lat === markerPosition.lat && (
          <InfoWindow
            position={markerPosition}
            onCloseClick={() => setActiveMarker(null)}
          >
            <Box sx={{ p: 1, bgcolor: 'background.paper', color: 'text.primary' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{markerInfo.title}</Typography>
              <Typography variant="body2">{markerInfo.content}</Typography>
              <Button size="small" href="https://es.wikipedia.org/wiki/Mazatl%C3%A1n" target="_blank" rel="noopener noreferrer" sx={{ mt: 1 }}>
                Más...
              </Button>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </Paper>
  );
}

function MapaBasico() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: "#FF3131", fontFamily: "Montserrat, sans-serif"}}>
        Mapa básico
      </Typography>
      <Box minWidth="600px">
        <MapComponent />
      </Box>
    </Box>
  );
}

export default MapaBasico;
