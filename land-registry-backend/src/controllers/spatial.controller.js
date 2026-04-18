// src/controllers/spatial.controller.js
const asyncHandler = require('../utils/asyncHandler');
const mahabhunaksha = require('../services/spatial/mahabhunaksha.service');
const Polygon = require('../models/Polygon.model');
const Land = require('../models/Land.model');
const logger = require('../utils/logger');

/**
 * GET /spatial/plot-boundary
 * Fetch plot boundary coordinates for a given survey number.
 * 
 * Query params:
 *   districtCode  - e.g. "27" or "5"
 *   surveyNo      - e.g. "100/A/1"
 *   villageCode   - optional village code
 *   landId        - optional, to look up saved polygon first
 *   lat, lng      - optional fallback center coordinates
 */
exports.getPlotBoundary = asyncHandler(async (req, res) => {
  const { districtCode, surveyNo, villageCode, landId, lat, lng } = req.query;

  // 1. Check if we already have a saved polygon in DB
  if (landId) {
    const saved = await Polygon.findOne({ land: landId, skipped: false })
      .sort({ createdAt: -1 })
      .lean();

    if (saved?.geoJson && !saved.skipped) {
      const coords = saved.geoJson.type === 'Feature'
        ? saved.geoJson.geometry?.coordinates?.[0]
        : saved.geoJson.coordinates?.[0];

      if (coords?.length) {
        const leafletCoords = coords.map(([x, y]) => [y, x]);
        const lats = leafletCoords.map(c => c[0]);
        const lngs = leafletCoords.map(c => c[1]);

        return res.json({
          success: true,
          source: 'database',
          coordinates: leafletCoords,
          center: [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2],
          bbox: [Math.min(...lats), Math.min(...lngs), Math.max(...lats), Math.max(...lngs)],
        });
      }
    }

    // Also try pulling coordinates from land's location
    const land = await Land.findById(landId).lean();
    if (land?.location) {
      // Use land location info to enrich query
      if (!districtCode && land.location.districtValue) {
        req.query.districtCode = land.location.districtValue;
      }
      if (!surveyNo && land.location.surveyNumber) {
        req.query.surveyNo = land.location.surveyNumber;
      }
      if (!villageCode && land.location.villageValue) {
        req.query.villageCode = land.location.villageValue;
      }
    }
  }

  const dc = req.query.districtCode || districtCode;
  const sn = req.query.surveyNo || surveyNo;
  const vc = req.query.villageCode || villageCode;

  // 2. Try Mahabhunaksha API
  if (dc && sn) {
    logger.info('Fetching plot boundary from Mahabhunaksha', { dc, sn });
    const result = await mahabhunaksha.fetchPlotGeometry({
      districtCode: dc,
      surveyNo: sn,
      villageCode: vc,
    });

    if (result) {
      return res.json({ success: true, ...result });
    }
  }

  // 3. Try Bhuvan WFS fallback (if lat/lng provided)
  if (lat && lng) {
    logger.info('Trying Bhuvan WFS fallback', { lat, lng });
    const bhuvanResult = await mahabhunaksha.fetchFromBhuvan({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    if (bhuvanResult) {
      return res.json({ success: true, ...bhuvanResult });
    }
  }

  // 4. Return mock polygon for demo/dev
  logger.warn('All spatial sources exhausted — returning mock polygon');
  const centerLat = lat ? parseFloat(lat) : 20.7002;
  const centerLng = lng ? parseFloat(lng) : 77.0082;

  const mock = mahabhunaksha.getMockPolygon({ lat: centerLat, lng: centerLng });

  return res.json({
    success: true,
    ...mock,
    message: 'Mock polygon (external API unavailable)'
  });
});
