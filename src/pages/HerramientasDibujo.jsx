import React, { useState, useCallback, useRef, useContext } from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import { MapContext } from './Layout';
import { Box, Paper, Typography, List, ListItem, ListItemText, Button, Divider, IconButton, Drawer } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 380;
const mapContainerOuterStyle = { position: 'relative', width: '100%', height: 'calc(100vh - 220px)' };
const mapContainerInnerStyle = { width: '100%', height: '100%' };
const mapCenter = { lat: 23.2494, lng: -106.4111 };
const mapDarkStyle = [{ elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] }, { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }, { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] }, { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] }, { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] }, { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] }, { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] }, { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] }, { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] }, { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] }, { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },];


const drawingManagerOptions = {
  drawingControl: true,
  drawingControlOptions: {
    position: typeof window !== 'undefined' && window.google ? window.google.maps.ControlPosition.TOP_CENTER : 1,
    drawingModes: typeof window !== 'undefined' && window.google ? [
      window.google.maps.drawing.OverlayType.POLYGON, window.google.maps.drawing.OverlayType.RECTANGLE,
      window.google.maps.drawing.OverlayType.POLYLINE, window.google.maps.drawing.OverlayType.CIRCLE,
      window.google.maps.drawing.OverlayType.MARKER,
    ] : ['polygon', 'rectangle', 'polyline', 'circle', 'marker'],
  },
  markerOptions: { draggable: true, icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" } },
  polylineOptions: { editable: true, strokeColor: '#90caf9' },
  rectangleOptions: { editable: true, fillColor: '#90caf9', strokeColor: '#90caf9', fillOpacity: 0.3 },
  circleOptions: { editable: true, fillColor: '#f48fb1', strokeColor: '#f48fb1', fillOpacity: 0.3 },
  polygonOptions: { editable: true, fillColor: '#90caf9', strokeColor: '#90caf9', fillOpacity: 0.3 },
};

function MapComponent({ onOverlayComplete, onDrawingManagerLoad }) {
  const { isLoaded } = useContext(MapContext);
  if (!isLoaded) return null;
  return (
    <GoogleMap
      mapContainerStyle={mapContainerInnerStyle} center={mapCenter} zoom={13}
      options={{ styles: mapDarkStyle, fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true }}
    >
      <DrawingManager onLoad={onDrawingManagerLoad} onOverlayComplete={onOverlayComplete} options={drawingManagerOptions} />
    </GoogleMap>
  );
}

function HerramientasDibujo() {
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const drawingManagerRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getPathCoords = (path) => path.getArray().map(c => ({ lat: c.lat(), lng: c.lng() }));
  const getRectCoords = (b) => [{ lat: b.getNorthEast().lat(), lng: b.getSouthWest().lng() }, { lat: b.getNorthEast().lat(), lng: b.getNorthEast().lng() }, { lat: b.getSouthWest().lat(), lng: b.getNorthEast().lng() }, { lat: b.getSouthWest().lat(), lng: b.getSouthWest().lng() }];
  const getCircleCoords = (c, r) => ({ center: { lat: c.lat(), lng: c.lng() }, radius: r });
  const getMarkerCoords = (m) => ({ lat: m.getPosition().lat(), lng: m.getPosition().lng() });

  const onOverlayComplete = useCallback((e) => {
    const newShape = e.overlay; newShape.googleMapsType = e.type;
    const id = Date.now();
    const info = { id, type: e.type, overlay: newShape };
    if (e.type === window.google.maps.drawing.OverlayType.POLYGON || e.type === window.google.maps.drawing.OverlayType.POLYLINE) info.coordinates = getPathCoords(newShape.getPath());
    else if (e.type === window.google.maps.drawing.OverlayType.RECTANGLE) info.coordinates = getRectCoords(newShape.getBounds());
    else if (e.type === window.google.maps.drawing.OverlayType.CIRCLE) info.coordinates = getCircleCoords(newShape.getCenter(), newShape.getRadius());
    else if (e.type === window.google.maps.drawing.OverlayType.MARKER) info.coordinates = getMarkerCoords(newShape);
    setDrawnShapes(p => [...p, info]);
    if (drawingManagerRef.current?.instance) drawingManagerRef.current.instance.setDrawingMode(null);
    newShape.addListener('click', () => { setSelectedShapeId(id); setDrawerOpen(true); });
  }, []);

  const onDrawingManagerLoad = useCallback(dm => { drawingManagerRef.current = dm; }, []);
  const delSelected = useCallback(() => { if (!selectedShapeId) return; const s = drawnShapes.find(sh => sh.id === selectedShapeId); if (s?.overlay) s.overlay.setMap(null); setDrawnShapes(p => p.filter(sh => sh.id !== selectedShapeId)); setSelectedShapeId(null); }, [selectedShapeId, drawnShapes]);
  const delAll = useCallback(() => { drawnShapes.forEach(s => s.overlay?.setMap(null)); setDrawnShapes([]); setSelectedShapeId(null); }, [drawnShapes]);
  const toggleDrawer = (open) => (e) => { if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return; setDrawerOpen(open); };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" color="primary">Formas Dibujadas</Typography>
        <IconButton onClick={toggleDrawer(false)}><ChevronLeftIcon /></IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {drawnShapes.length === 0 && <Typography variant="body2" color="textSecondary" textAlign="center" mt={2}>No hay formas.</Typography>}
      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        <List dense>{drawnShapes.map((s, i) => (
          <ListItem key={s.id} disablePadding secondaryAction={selectedShapeId === s.id ? <IconButton edge="end" onClick={delSelected} size="small"><DeleteIcon fontSize="small" color="error" /></IconButton> : null}
            sx={{ mb: 1.5, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: selectedShapeId === s.id ? 'action.hover' : 'transparent', '&:hover': { bgcolor: 'action.selected' } }}
            onClick={() => { setSelectedShapeId(s.id); if (s.overlay?.getMap()) { const m = s.overlay.getMap(); if (s.type === window.google.maps.drawing.OverlayType.MARKER) m.panTo(s.overlay.getPosition()); else if (s.overlay.getBounds) m.fitBounds(s.overlay.getBounds()); } }}
          >
            <ListItemText primary={`Forma ${i + 1}: ${s.type.toString().replace('google.maps.drawing.OverlayType.', '').toLowerCase()}`}
              primaryTypographyProps={{ variant: 'subtitle1', textTransform: 'capitalize', fontWeight: 'medium' }}
              secondary={<Box component="div" fontSize="0.75rem" mt={0.5} wordBreak="break-all">
                {s.type === window.google.maps.drawing.OverlayType.MARKER && s.coordinates && `Lat: ${s.coordinates.lat.toFixed(4)}, Lng: ${s.coordinates.lng.toFixed(4)}`}
                {s.type === window.google.maps.drawing.OverlayType.CIRCLE && s.coordinates && `Centro: Lat: ${s.coordinates.center.lat.toFixed(4)}, Lng: ${s.coordinates.center.lng.toFixed(4)} | Radio: ${s.coordinates.radius.toFixed(1)}m`}
                {(s.type === window.google.maps.drawing.OverlayType.POLYGON || s.type === window.google.maps.drawing.OverlayType.POLYLINE || s.type === window.google.maps.drawing.OverlayType.RECTANGLE) && s.coordinates?.map((c, idx) => <div key={idx}>{`Vértice ${idx + 1}: Lat: ${c.lat.toFixed(4)}, Lng: ${c.lng.toFixed(4)}`}</div>)}
              </Box>} />
          </ListItem>))}
        </List>
      </Box>
      {drawnShapes.length > 0 && <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
        {selectedShapeId && <Button variant="contained" color="error" onClick={delSelected} fullWidth startIcon={<DeleteIcon />} sx={{ mb: 1 }}>Eliminar Seleccionada</Button>}
        <Button variant="outlined" color="inherit" onClick={delAll} fullWidth startIcon={<ClearAllIcon />}>Eliminar Todas</Button>
      </Box>}
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={800} sx={{ color: "#FF3131", fontFamily: "Montserrat, sans-serif" }}>
        Herramientas de dibujo
      </Typography>
      <Box minWidth="600px" sx={{ ...mapContainerOuterStyle, mt: 3 }}>
        <MapComponent onOverlayComplete={onOverlayComplete} onDrawingManagerLoad={onDrawingManagerLoad} />
        <IconButton onClick={toggleDrawer(true)}
          sx={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' }, display: drawerOpen ? 'none' : 'flex' }}
          aria-label="Abrir panel de formas"
        ><MenuIcon color="primary" /></IconButton>
      </Box>
      <Drawer variant="persistent" anchor="right" open={drawerOpen}
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', height: `calc(100% - 64px)`, top: `64px`, bgcolor: 'background.paper' } }}
      >{drawerContent}</Drawer>
    </Box>
  );
}

export default HerramientasDibujo;
