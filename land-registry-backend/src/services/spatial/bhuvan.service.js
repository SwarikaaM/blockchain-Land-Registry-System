const logger = require('../../utils/logger');

/**
 * Bhuvan Satellite Imagery Service.
 *
 * Integrates with ISRO's Bhuvan WMS/WMTS APIs to fetch satellite tiles
 * for display on Leaflet maps. Used for polygon mapping step.
 *
 * Bhuvan WMS endpoint: https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms
 */

const BHUVAN_WMS_BASE = 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms';

/**
 * Build a Bhuvan WMS tile URL for Leaflet.
 *
 * @param {Object} options - { layer, bbox, width, height, srs, format }
 * @returns {string} WMS GetMap URL
 */
exports.buildWmsTileUrl = (options = {}) => {
  const {
    layer = 'india3',
    bbox,
    width = 256,
    height = 256,
    srs = 'EPSG:4326',
    format = 'image/png'
  } = options;

  if (!bbox) throw new Error('Bounding box (bbox) is required');

  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    layers: layer,
    bbox,
    width: String(width),
    height: String(height),
    srs,
    format,
    transparent: 'true'
  });

  return `${BHUVAN_WMS_BASE}?${params.toString()}`;
};

/**
 * Get Leaflet-compatible tile layer config for Bhuvan.
 * This config is sent to the frontend for Leaflet integration.
 *
 * @param {string} layer - Bhuvan layer name
 * @returns {Object} Leaflet tile layer configuration
 */
exports.getLeafletConfig = (layer = 'india3') => {
  return {
    url: `${BHUVAN_WMS_BASE}`,
    type: 'wms',
    options: {
      layers: layer,
      format: 'image/png',
      transparent: true,
      attribution: '© ISRO Bhuvan',
      maxZoom: 19,
      tileSize: 256
    }
  };
};

/**
 * Get available Bhuvan layers for Maharashtra land imagery.
 */
exports.getMaharashtraLayers = () => {
  return [
    { id: 'india3', name: 'India Satellite (Cartosat)', description: 'High-res satellite imagery' },
    { id: 'mh_village', name: 'Maharashtra Villages', description: 'Village boundary layer' },
    { id: 'mh_taluka', name: 'Maharashtra Talukas', description: 'Taluka boundary layer' },
    { id: 'mh_district', name: 'Maharashtra Districts', description: 'District boundary layer' }
  ];
};

/**
 * Build a bounding box from a GeoJSON polygon for Bhuvan tile requests.
 *
 * @param {Object} geoJson - GeoJSON Feature or Polygon
 * @returns {string} bbox string "minLng,minLat,maxLng,maxLat"
 */
exports.bboxFromGeoJson = (geoJson) => {
  const coords = geoJson.type === 'Feature'
    ? geoJson.geometry.coordinates[0]
    : geoJson.coordinates[0];

  if (!coords || coords.length === 0) {
    throw new Error('No coordinates found in GeoJSON');
  }

  let minLng = Infinity, minLat = Infinity;
  let maxLng = -Infinity, maxLat = -Infinity;

  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  // Add a small buffer (0.001 degrees ≈ 111m)
  const buffer = 0.001;
  return `${minLng - buffer},${minLat - buffer},${maxLng + buffer},${maxLat + buffer}`;
};
