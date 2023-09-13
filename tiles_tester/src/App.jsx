import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

function App() {
  const latLng = [34.105551, 22.754198];

  // BOUNDS logic
  const southAmericaNW = L.latLng(48.774293, 3.424946);
  const southAmericaSE = L.latLng(34.105551, 22.754198);
  const bounds = L.latLngBounds(southAmericaNW, southAmericaSE);

  // Map Configuration
  const map_config = {
    zoom: 1,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    attributionControl: true,
    dragging: true,
    maxBoundsViscosity: 1.0,
    bounds: bounds,
    minZoom: 1,
    maxZoom: 6,
    center: latLng,
  };

  return (
    <>
      <div className="app-container">
        <div className="container">
          <div id="map">
            <MapContainer {...map_config}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                url="assets/tiles/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
