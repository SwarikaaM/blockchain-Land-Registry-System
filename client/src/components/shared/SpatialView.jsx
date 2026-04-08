import React from 'react';
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SpatialView = ({ 
  center = [18.5362, 73.9167], 
  zoom = 15, 
  polygonData = null, 
  markers = [], 
  className = "w-full h-full min-h-[300px]" 
}) => {
  
  // Default mock polygon around the center if none provided but we want to show a boundary
  const defaultPolygon = [
    [center[0] + 0.002, center[1] - 0.003],
    [center[0] + 0.002, center[1] + 0.004],
    [center[0] - 0.002, center[1] + 0.003],
    [center[0] - 0.003, center[1] - 0.002],
  ];

  return (
    <div className={`relative ${className}`}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {polygonData !== false && (
          <Polygon 
            positions={polygonData || defaultPolygon} 
            pathOptions={{ color: '#38bdf8', fillColor: '#38bdf8', fillOpacity: 0.2, weight: 2 }} 
          />
        )}
        
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            {/* Can add popups here if needed later */}
          </Marker>
        ))}

      </MapContainer>

      {/* Geospatial overlay badge to match previous UI mock */}
      <div className="absolute top-4 right-4 bg-[#14151a]/80 backdrop-blur-md border border-[#23252d] p-3 rounded text-[10px] text-[#9ca3af] font-mono leading-relaxed z-[1000] pointer-events-none">
        <p className="text-[#e5e4ed] mb-1 uppercase tracking-widest font-sans font-bold text-[9px]">Geospatial Focus</p>
        Lat: {center[0].toFixed(4)}&deg; N<br/>Lon: {center[1].toFixed(4)}&deg; E
      </div>
    </div>
  );
};

export default SpatialView;
