/**
 * GeoJSON validation and area computation service.
 */

const VALID_TYPES = ['Point', 'LineString', 'Polygon', 'MultiPolygon', 'Feature', 'FeatureCollection'];

/**
 * Validate a GeoJSON object.
 */
exports.validate = (geo) => {
  if (!geo) throw new Error('GeoJSON is required');

  // If it's a Feature, validate the geometry
  if (geo.type === 'Feature') {
    if (!geo.geometry) throw new Error('Feature must have a geometry');
    return exports.validate(geo.geometry);
  }

  if (!VALID_TYPES.includes(geo.type)) {
    throw new Error(`Invalid GeoJSON type: ${geo.type}. Valid: ${VALID_TYPES.join(', ')}`);
  }

  if (geo.type !== 'Feature' && geo.type !== 'FeatureCollection' && !geo.coordinates) {
    throw new Error('GeoJSON must have coordinates');
  }

  // Validate Polygon coordinates structure
  if (geo.type === 'Polygon') {
    if (!Array.isArray(geo.coordinates) || geo.coordinates.length === 0) {
      throw new Error('Polygon must have at least one ring');
    }
    const ring = geo.coordinates[0];
    if (ring.length < 4) {
      throw new Error('Polygon ring must have at least 4 positions (first = last)');
    }
  }

  return true;
};

/**
 * Compute area of a GeoJSON polygon in square meters.
 * Uses @turf/area if available.
 */
exports.computeArea = (geoJson) => {
  try {
    const turfArea = require('@turf/area');
    const areaFn = turfArea.default || turfArea;

    if (geoJson.type === 'Feature') {
      return areaFn(geoJson);
    }

    return areaFn({ type: 'Feature', geometry: geoJson, properties: {} });
  } catch (err) {
    // Fallback: return 0 if turf not available
    return 0;
  }
};