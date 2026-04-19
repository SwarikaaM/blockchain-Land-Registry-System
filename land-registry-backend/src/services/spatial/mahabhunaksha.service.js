// src/services/spatial/mahabhunaksha.service.js
const axios = require('axios');
const logger = require('../../utils/logger');

/**
 * Fetches plot boundary coordinates from Mahabhunaksha.
 * Uses the ArcGIS MapServer behind the portal.
 *
 * Base: https://mahabhunaksha.mahabhumi.gov.in/
 * Tile service layers expose plot geometries via REST query.
 */

const BASE_URL = 'https://mahabhunaksha.mahabhumi.gov.in';

// District code → layer index mapping (top-level REST service)
// Layer 0 = survey boundaries statewide
const REST_BASE = `${BASE_URL}/bhunakshaservice/rest/services`;

/**
 * Query plot geometry from Mahabhunaksha REST API.
 * Returns GeoJSON-compatible polygon coordinates or null.
 *
 * @param {Object} params
 * @param {string} params.districtCode  e.g. "27" (Maharashtra LGCD)
 * @param {string} params.surveyNo      e.g. "100/A/1"
 * @param {string} params.villageCode   e.g. "270500040051260000"
 * @returns {Promise<{coordinates: number[][], bbox: number[], center: number[]} | null>}
 */
exports.fetchPlotGeometry = async ({ districtCode, surveyNo, villageCode }) => {
  try {
    // Mahabhunaksha REST endpoint for parcel query
    // Layer 2 typically holds plot/survey parcel polygons
    const queryUrl = `${REST_BASE}/MH_${districtCode}/MapServer/2/query`;

    const params = {
      where: `SURVEYNO='${surveyNo}'`,
      outFields: '*',
      f: 'geojson',
      returnGeometry: true,
      outSR: 4326,  // WGS84
    };

    // Add village filter if provided
    if (villageCode) {
      params.where += ` AND VILLAGECODE='${villageCode}'`;
    }

    const response = await axios.get(queryUrl, {
      params,
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': BASE_URL,
      }
    });

    const data = response.data;

    if (!data?.features?.length) {
      logger.warn('Mahabhunaksha: no features returned', { districtCode, surveyNo });
      return null;
    }

    const feature = data.features[0];
    const geometry = feature.geometry;

    if (!geometry?.coordinates?.length) {
      return null;
    }

    // Convert to flat lat/lng array for Leaflet [[lat,lng],...]
    const rawCoords = geometry.type === 'MultiPolygon'
      ? geometry.coordinates[0][0]
      : geometry.coordinates[0];

    const leafletCoords = rawCoords.map(([lng, lat]) => [lat, lng]);

    // Calculate bounding box and center
    const lats = leafletCoords.map(c => c[0]);
    const lngs = leafletCoords.map(c => c[1]);
    const bbox = [Math.min(...lats), Math.min(...lngs), Math.max(...lats), Math.max(...lngs)];
    const center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

    return {
      coordinates: leafletCoords,
      bbox,
      center,
      properties: feature.properties || {},
      source: 'mahabhunaksha'
    };

  } catch (err) {
    logger.error('Mahabhunaksha fetch failed', { error: err.message, districtCode, surveyNo });
    return null;
  }
};

/**
 * Fallback: derive approximate bounding box from Bhuvan WMS GetFeatureInfo.
 * Used when REST query returns no results.
 */
exports.fetchFromBhuvan = async ({ lat, lng, zoom = 15 }) => {
  try {
    // Bhuvan WMTS tile coordinate → approximate parcel bbox
    const bhuvanUrl = 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wfs';

    const params = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'cadastral:mh_survey',
      bbox: `${lng - 0.001},${lat - 0.001},${lng + 0.001},${lat + 0.001}`,
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
    };

    const response = await axios.get(bhuvanUrl, { params, timeout: 10000 });
    const data = response.data;

    if (!data?.features?.length) return null;

    const feature = data.features[0];
    const coords = feature.geometry?.coordinates?.[0];
    if (!coords) return null;

    const leafletCoords = coords.map(([x, y]) => [y, x]);
    const lats = leafletCoords.map(c => c[0]);
    const lngs = leafletCoords.map(c => c[1]);

    return {
      coordinates: leafletCoords,
      bbox: [Math.min(...lats), Math.min(...lngs), Math.max(...lats), Math.max(...lngs)],
      center: [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2],
      properties: feature.properties || {},
      source: 'bhuvan'
    };
  } catch (err) {
    logger.warn('Bhuvan WFS fallback failed', { error: err.message });
    return null;
  }
};

/**
 * Generate a mock polygon for development/testing.
 * Used when both APIs are unavailable.
 */
exports.getMockPolygon = ({ lat = 20.7002, lng = 77.0082 } = {}) => {
  const d = 0.002; // ~200m
  return {
    coordinates: [
      [lat + d, lng - d],
      [lat + d * 0.3, lng + d],
      [lat - d * 0.5, lng + d * 1.2],
      [lat - d, lng + d * 0.4],
      [lat - d * 0.8, lng - d * 0.8],
      [lat + d * 0.2, lng - d * 1.1],
      [lat + d, lng - d],
    ],
    bbox: [lat - d, lng - d, lat + d, lng + d],
    center: [lat, lng],
    properties: { mock: true },
    source: 'mock'
  };
};
