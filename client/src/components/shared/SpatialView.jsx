import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/** Flyto helper — fits map to polygon bounds */
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds?.length === 4) {
      // bounds = [minLat, minLng, maxLat, maxLng]
      map.fitBounds(
        [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
        { padding: [40, 40] }
      );
    }
  }, [bounds, map]);
  return null;
};

/**
 * SpatialView
 *
 * Props:
 *   landId        - MongoDB land _id (auto-fetches polygon)
 *   districtCode  - e.g. "5" (from land.location.districtValue)
 *   surveyNo      - e.g. "100/अ/1"
 *   villageCode   - village code string
 *   center        - [lat, lng] fallback center
 *   zoom          - initial zoom
 *   polygonData   - manual override coordinates [[lat,lng],...]
 *                   pass `false` to disable default mock polygon
 *   markers       - [{position:[lat,lng]}]
 *   className     - container class
 *   showControls  - show fetch input UI (default false)
 */
const SpatialView = ({
  landId,
  districtCode,
  surveyNo,
  villageCode,
  center = [18.5362, 73.9167],
  zoom = 15,
  polygonData = null,
  markers = [],
  className = 'w-full h-full min-h-[300px]',
  showControls = false,
}) => {
  const [polygon, setPolygon] = useState(null);   // [[lat,lng],...]
  const [mapCenter, setMapCenter] = useState(center);
  const [bbox, setBbox] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  // Manual input state (when showControls=true)
  const [inputDistrict, setInputDistrict] = useState(districtCode || '');
  const [inputSurvey, setInputSurvey] = useState(surveyNo || '');
  const [inputVillage, setInputVillage] = useState(villageCode || '');

  const fetchPolygon = useCallback(async (dc, sn, vc, lid) => {
    if (!dc && !sn && !lid && polygonData === null) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (dc) params.districtCode = dc;
      if (sn) params.surveyNo = sn;
      if (vc) params.villageCode = vc;
      if (lid) params.landId = lid;
      params.lat = center[0];
      params.lng = center[1];

      const res = await api.get('/spatial/plot-boundary', { params });
      const data = res.data;

      if (data?.coordinates?.length) {
        setPolygon(data.coordinates);
        setSource(data.source);
        if (data.center) setMapCenter(data.center);
        if (data.bbox) setBbox(data.bbox);
      } else {
        setError('No boundary data available');
      }
    } catch (err) {
      setError('Failed to fetch boundary');
      console.error('SpatialView fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [center, polygonData]);

  // Auto-fetch when props change
  useEffect(() => {
    if (polygonData !== null && polygonData !== false) {
      // Manual polygon provided — use it directly
      setPolygon(polygonData);
      return;
    }
    if (polygonData === false) {
      setPolygon(null);
      return;
    }
    // Auto-fetch if we have identifiers
    if (landId || districtCode || surveyNo) {
      fetchPolygon(districtCode, surveyNo, villageCode, landId);
    }
  }, [landId, districtCode, surveyNo, villageCode, polygonData, fetchPolygon]);

  // Default mock polygon if nothing fetched (for display)
  const defaultPolygon = [
    [center[0] + 0.002, center[1] - 0.003],
    [center[0] + 0.002, center[1] + 0.004],
    [center[0] - 0.002, center[1] + 0.003],
    [center[0] - 0.003, center[1] - 0.002],
  ];

  const displayPolygon = polygon || (polygonData !== false ? defaultPolygon : null);
  const sourceLabel = source
    ? source === 'mock' ? 'Demo Boundary' : source === 'database' ? 'Saved Polygon' : source === 'mahabhunaksha' ? 'Mahabhunaksha' : 'Bhuvan NRSC'
    : 'Demo Boundary';

  return (
    <div className={`relative ${className}`} style={{ minHeight: 300 }}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-[#11131a]/80 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#8470FF] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#9ca3af] font-mono">Fetching boundary...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 z-[1500] bg-[#14151a]/95 backdrop-blur border border-[#23252d] rounded-lg p-3 space-y-2 w-64">
          <p className="text-[9px] uppercase tracking-widest text-[#6b7280] font-bold">Plot Search</p>
          <input
            value={inputSurvey}
            onChange={e => setInputSurvey(e.target.value)}
            placeholder="Survey No. e.g. 100/अ/1"
            className="w-full bg-[#23252d] text-white text-xs rounded px-2 py-1.5 border-none focus:ring-1 focus:ring-[#8470FF]/50 placeholder:text-[#4b5563]"
          />
          <div className="flex gap-1.5">
            <input
              value={inputDistrict}
              onChange={e => setInputDistrict(e.target.value)}
              placeholder="District code"
              className="flex-1 bg-[#23252d] text-white text-xs rounded px-2 py-1.5 border-none focus:ring-1 focus:ring-[#8470FF]/50 placeholder:text-[#4b5563]"
            />
            <input
              value={inputVillage}
              onChange={e => setInputVillage(e.target.value)}
              placeholder="Village code"
              className="flex-1 bg-[#23252d] text-white text-xs rounded px-2 py-1.5 border-none focus:ring-1 focus:ring-[#8470FF]/50 placeholder:text-[#4b5563]"
            />
          </div>
          <button
            onClick={() => fetchPolygon(inputDistrict, inputSurvey, inputVillage, landId)}
            disabled={loading}
            className="w-full py-1.5 bg-[#8470FF]/20 hover:bg-[#8470FF]/30 border border-[#8470FF]/30 text-[#8470FF] text-xs font-bold rounded transition-colors disabled:opacity-40"
          >
            {loading ? 'Searching...' : 'Fetch Boundary'}
          </button>
          {error && <p className="text-[10px] text-[#F43F5E]">{error}</p>}
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1, minHeight: 300 }}
        key={`map-${mapCenter[0]}-${mapCenter[1]}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Fit bounds when bbox is available */}
        {bbox && <FitBounds bounds={bbox} />}

        {/* Plot polygon */}
        {displayPolygon && (
          <Polygon
            positions={displayPolygon}
            pathOptions={{
              color: '#8470FF',
              fillColor: '#8470FF',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: source === 'mock' || !source ? '6 4' : undefined,
            }}
          />
        )}

        {/* Additional markers */}
        {markers.map((m, i) => (
          <Marker key={i} position={m.position} />
        ))}
      </MapContainer>

      {/* Info badge */}
      <div className="absolute top-4 right-4 bg-[#14151a]/85 backdrop-blur-md border border-[#23252d] px-3 py-2 rounded text-[10px] text-[#9ca3af] font-mono z-[1000] pointer-events-none leading-relaxed">
        <p className="text-[#e5e4ed] mb-0.5 uppercase tracking-widest font-sans font-bold text-[9px]">
          {sourceLabel}
        </p>
        Lat: {mapCenter[0].toFixed(4)}° N<br />
        Lon: {mapCenter[1].toFixed(4)}° E
      </div>

      {/* Source indicator */}
      {source && source !== 'mock' && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-[#059669]/20 border border-[#059669]/40 text-[#10B981] text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded pointer-events-none">
          ✓ Live boundary data
        </div>
      )}
      {(!source || source === 'mock') && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-[#23252d]/80 border border-[#2d3039] text-[#6b7280] text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded pointer-events-none">
          Demo overlay
        </div>
      )}
    </div>
  );
};

export default SpatialView;
