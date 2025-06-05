import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import { MapContext } from './Layout';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

const initialCenter = {
  lat: 23.22,
  lng: -106.42
};

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

function RoutePlannerComponent() {
  const { isLoaded, loadError } = useContext(MapContext);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const originAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  const onLoadOrigin = (autocomplete) => {
    originAutocompleteRef.current = autocomplete;
  };

  const onPlaceChangedOrigin = () => {
    if (originAutocompleteRef.current !== null) {
      const place = originAutocompleteRef.current.getPlace();
      setOrigin(place.formatted_address || place.name);
    } else {
      console.log('Autocomplete for origin is not loaded yet!');
    }
  };

  const onLoadDestination = (autocomplete) => {
    destinationAutocompleteRef.current = autocomplete;
  };

  const onPlaceChangedDestination = () => {
    if (destinationAutocompleteRef.current !== null) {
      const place = destinationAutocompleteRef.current.getPlace();
      setDestination(place.formatted_address || place.name);
    } else {
      console.log('Autocomplete for destination is not loaded yet!');
    }
  };

  const calculateRoute = useCallback(() => {
    if (!origin || !destination) {
      setError('Por favor, ingresa un origen y un destino válidos.');
      setDirectionsResponse(null);
      setDistance('');
      setDuration('');
      return;
    }
    setError(null);
    setLoadingRoute(true);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode],
      },
      (result, status) => {
        setLoadingRoute(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
        } else {
          console.error(`Error al obtener la ruta: ${status}`);
          setError(`No se pudo calcular la ruta: ${status}. Verifica las direcciones.`);
          setDirectionsResponse(null);
          setDistance('');
          setDuration('');
        }
      }
    );
  }, [origin, destination, travelMode]);

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
  };

  useEffect(() => {
    console.log('MapContext isLoaded:', isLoaded, 'loadError:', loadError);
    if (isLoaded && origin && destination) {
      calculateRoute();
    }
  }, [origin, destination, travelMode, isLoaded, calculateRoute, loadError]);

  if (loadError) {
    console.error("Mapa falló en cargar (RoutePlannerComponent):", loadError.message);
    return <Alert severity="error" sx={{ m: 2 }}>Error al cargar Google Maps: {loadError.message}</Alert>;
  }

  if (!isLoaded) {
    console.log("Mapa no cargado (RoutePlannerComponent), mostrando spinner...");
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando mapa y servicios...</Typography>
      </Box>
    );
  }

  console.log("Mapa cargado (RoutePlannerComponent), intentando renderizar GoogleMap.");

  return (
    <Grid container spacing={2} sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1, overflow: 'hidden', height: '100%' }}>
      <Grid item xs={12} md={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Planificador de Ruta
          </Typography>
          <Autocomplete onLoad={onLoadOrigin} onPlaceChanged={onPlaceChangedOrigin}>
            <TextField
              fullWidth
              label="Origen"
              variant="outlined"
              margin="normal"
              size="small"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ej: Valentinos, Mazatlán"
            />
          </Autocomplete>
          <Autocomplete onLoad={onLoadDestination} onPlaceChanged={onPlaceChangedDestination}>
            <TextField
              fullWidth
              label="Destino"
              variant="outlined"
              margin="normal"
              size="small"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ej: Plazuela Machado, Mazatlán"
            />
          </Autocomplete>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>Modo de Viaje:</Typography>
          <ButtonGroup
            fullWidth
            variant="outlined"
            aria-label="Modo de viaje"
            orientation="vertical"
            size="small"
          >
            <Button onClick={() => handleTravelModeChange('DRIVING')} variant={travelMode === 'DRIVING' ? 'contained' : 'outlined'} startIcon={<DriveEtaIcon />}>Coche</Button>
            <Button onClick={() => handleTravelModeChange('WALKING')} variant={travelMode === 'WALKING' ? 'contained' : 'outlined'} startIcon={<DirectionsWalkIcon />}>Caminando</Button>
            <Button onClick={() => handleTravelModeChange('BICYCLING')} variant={travelMode === 'BICYCLING' ? 'contained' : 'outlined'} startIcon={<DirectionsBikeIcon />}>Bicicleta</Button>
          </ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateRoute}
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            disabled={loadingRoute || !origin || !destination}
          >
            {loadingRoute ? <CircularProgress size={24} color="inherit" /> : 'Calcular Ruta'}
          </Button>
          {error && <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>}
          {distance && duration && !error && (
            <Box sx={{ mt: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2">Distancia: {distance}</Typography>
              <Typography variant="body2">Duración Estimada: {duration}</Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={9} sx={{ height: '100%' }}>
        <Box sx={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '500px' }}
            center={initialCenter}
            zoom={12}
            options={{ styles: mapDarkStyle, fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
          >
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          </GoogleMap>
        </Box>
      </Grid>
    </Grid>
  );
}

function RutasDinamicas() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', p: { xs: 1, md: 2 } }}>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: "#FF3131", fontFamily: "Montserrat, sans-serif" }}>
        Rutas dinámicas
      </Typography>
      <Box minWidth="600px">
        <RoutePlannerComponent />
      </Box>  
    </Box>
  );
}

export default RutasDinamicas;
