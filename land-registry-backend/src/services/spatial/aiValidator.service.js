const logger = require('../../utils/logger');

/**
 * AI Validator Service — Advisory polygon comparison.
 *
 * In production, this would integrate with SAM2/U-Net models to compare
 * user-drawn polygon boundaries against satellite imagery features.
 * For now, provides advisory-only stub warnings.
 */

/**
 * Compare a user-drawn polygon against expected satellite features.
 * Returns advisory warnings only — never blocks the workflow.
 *
 * @param {Object} userPolygon - GeoJSON polygon drawn by user
 * @param {Object} options - { landId, satelliteSource }
 * @returns {{ warnings: Array, confidence: number, status: string }}
 */
exports.comparePolygon = async (userPolygon, options = {}) => {
  const { landId, satelliteSource = 'bhuvan' } = options;

  logger.info('AI polygon validation (advisory)', { landId, satelliteSource });

  // Stub: In production, this would:
  // 1. Fetch satellite imagery tile for the polygon bounding box
  // 2. Run SAM2/U-Net segmentation to detect field boundaries
  // 3. Compare segmented boundaries with user-drawn polygon
  // 4. Return overlap score, boundary alignment, and advisory warnings

  return {
    status: 'advisory',
    confidence: 0,  // 0 = no AI model connected
    modelVersion: 'stub-v1',
    warnings: [],
    message: 'AI boundary validation not yet connected. Polygon accepted as-is.'
  };
};

/**
 * Check for overlap between the user polygon and existing registered polygons.
 * Returns advisory warnings for potential boundary conflicts.
 *
 * @param {Object} userPolygon - GeoJSON polygon
 * @param {Object[]} existingPolygons - Array of existing polygon GeoJSON objects
 * @returns {{ overlaps: Array }}
 */
exports.checkOverlaps = async (userPolygon, existingPolygons = []) => {
  const overlaps = [];

  try {
    const booleanOverlap = require('@turf/boolean-overlap').default || require('@turf/boolean-overlap');

    for (const existing of existingPolygons) {
      if (!existing.geoJson || existing.skipped) continue;

      const userFeature = userPolygon.type === 'Feature'
        ? userPolygon
        : { type: 'Feature', geometry: userPolygon, properties: {} };

      const existingFeature = existing.geoJson.type === 'Feature'
        ? existing.geoJson
        : { type: 'Feature', geometry: existing.geoJson, properties: {} };

      try {
        if (booleanOverlap(userFeature, existingFeature)) {
          overlaps.push({
            landId: existing.land,
            type: 'overlap',
            severity: 'warning',
            message: `Potential overlap detected with land ${existing.land}`
          });
        }
      } catch (e) {
        logger.debug('Overlap check skipped for polygon', { error: e.message });
      }
    }
  } catch (err) {
    logger.warn('Turf boolean-overlap not available', { error: err.message });
  }

  return { overlaps };
};
