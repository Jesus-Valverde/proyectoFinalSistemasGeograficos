import React, { useState, useMemo, useContext } from 'react';
import { GoogleMap, MarkerF, MarkerClustererF } from '@react-google-maps/api';
import { MapContext } from './Layout';
import { Box, Paper, Typography } from '@mui/material';

const containerStyle = { width: '100%', height: '600px' };
const mapCenter = { lat: 23.2494, lng: -106.4111 };
const mapDarkStyle = [ { elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }, ];


const generateRandomMarkers = (count, center) => {
  const markers = [];
  for (let i = 0; i < count; i++) {
    markers.push({
      id: `marker-${i}`,
      lat: center.lat + (Math.random() - 0.5) * 0.2,
      lng: center.lng + (Math.random() - 0.5) * 0.2
    });
  }
  return markers;
};

function MapComponent() {
  const { isLoaded } = useContext(MapContext);
  const [activeMarker, setActiveMarker] = useState(null);
  const locations = useMemo(() => generateRandomMarkers(200, mapCenter), []);

  const handleMarkerClick = (markerId) => {
    setActiveMarker(markerId);
  };

  if (!isLoaded) return null;

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={11}
        options={{ styles: mapDarkStyle }}
      >
        <MarkerClustererF
          options={{ 
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            styles: [
              { textColor: 'white', textSize: 14, url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png', height: 53, width: 53 },
              { textColor: 'white', textSize: 14, url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png', height: 56, width: 56 },
              { textColor: 'white', textSize: 14, url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png', height: 66, width: 66 },
              { textColor: 'white', textSize: 14, url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m4.png', height: 78, width: 78 },
              { textColor: 'white', textSize: 14, url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m5.png', height: 90, width: 90 },
            ]
          }}
        >
          {(clusterer) =>
            locations.map((location) => (
              <MarkerF
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                clusterer={clusterer}
                onClick={() => handleMarkerClick(location.id)}
              />
            ))
          }
        </MarkerClustererF>
      </GoogleMap>
    </Paper>
  );
}

function MapaClusters() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: "#FF3131", fontFamily: "Montserrat, sans-serif"}}>
              Mapa clusters
            </Typography>
            <Box minWidth="600px">
              <MapComponent />
            </Box>
    </Box>
  );
}

export default MapaClusters;
