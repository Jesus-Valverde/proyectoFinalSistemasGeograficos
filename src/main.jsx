import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../style.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout.jsx";
import Inicio from './pages/inicio.jsx';
import MapaBasico from './pages/MapaBasico.jsx';
import RutaDosPuntos from './pages/RutaDosPuntos.jsx';
import MapaClusters from './pages/MapaClusters.jsx';
import HerramientasDibujo from './pages/HerramientasDibujo.jsx';
import RutasDinamicas from './pages/RutasDinamicas.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} /> 
          <Route path="MapaBasico" element={<MapaBasico />} />
          <Route path="RutaDosPuntos" element={<RutaDosPuntos />} />
          <Route path="MapaClusters" element={<MapaClusters />} />
          <Route path="HerramientasDibujo" element={<HerramientasDibujo />} />
          <Route path="RutasDinamicas" element={<RutasDinamicas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
