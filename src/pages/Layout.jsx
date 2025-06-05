import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Container, CircularProgress, Alert } from "@mui/material";
import { useJsApiLoader } from '@react-google-maps/api';
import '../../style.css'; 

export const MapContext = React.createContext();

const LIBRARIES_TO_LOAD = ['places', 'drawing'];

const Layout = () => {
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES_TO_LOAD,
  });

  const renderContent = () => {
    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
      return <Alert severity="error" sx={{ m: 2, mt: "84px" }}>API Key no configurada.</Alert>;
    }
    if (loadError) {
      return <Alert severity="error" sx={{ m: 2, mt: "84px" }}>Error al cargar Google Maps: {loadError.message}</Alert>;
    }
    if (!isLoaded) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)', mt: "64px" }}>
          <CircularProgress />
        </Box>
      );
    }
    return <Outlet />;
  };

  return (
    <MapContext.Provider value={{ isLoaded, loadError }}>
      <header className="header">
        <div className="logo__container">
          <a href="/" className="logo__link">
            <img className="logo__img" src="/images/logo/logo.png" alt="logo personal" />
            <p className="logo__txt">JESVAL</p>
          </a>
        </div>

        <nav className="nav">
          <ul className="nav__list">
            <li><a onClick={() => navigate("/")} className="link__inicio">INICIO</a></li>
            <li><a onClick={() => navigate("/MapaBasico")} className="link__proyectos">MAPA BÁSICO</a></li>
            <li><a onClick={() => navigate("/RutaDosPuntos")} className="link__proyectos">RUTA CON DOS PUNTOS</a></li>
            <li><a onClick={() => navigate("/MapaClusters")} className="link__proyectos">MAPA CLUSTERS</a></li>
            <li><a onClick={() => navigate("/HerramientasDibujo")} className="link__proyectos">HERRAMIENTAS DE DIBUJO</a></li>
            <li><a onClick={() => navigate("/RutasDinamicas")} className="link__proyectos">RUTAS DINÁMICAS</a></li>
          </ul>
        </nav>
      </header>

      <Container component="main" sx={{ marginTop: "64px", padding: "20px", minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </Container>
    </MapContext.Provider>
  );
};

export default Layout;
