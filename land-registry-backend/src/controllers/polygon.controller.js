const asyncHandler = require('../utils/asyncHandler');
const Polygon = require('../models/Polygon.model');
const Land = require('../models/Land.model');
const ipfsPinService = require('../services/ipfs/pin.service');
const { validate: validateGeoJson } = require('../services/spatial/geojson.service');
const logger = require('../utils/logger');

let turfArea;
try { turfArea = require('@turf/area').default || require('@turf/area'); } catch (e) { turfArea = null; }

/**
 * POST /land/:id/polygon
 * Save a GeoJSON polygon for a land asset.
 * Skips if land area < 500 sqm.
 */
exports.savePolygon = asyncHandler(async (req, res) => {
  const land = await Land.findById(req.params.id);
  if (!land) return res.status(404).json({ success: false, error: 'Land not found' });

  if (land.owner.toString() !== req.userId.toString()) {
    return res.status(403).json({ success: false, error: 'Not the owner' });
  }

  const { geoJson, source } = req.body;

  // Check if area < 500sqm → skip polygon
  const { toSqm } = require('../utils/areaConvert');
  const areaSqm = toSqm(land.area.value, land.area.unit);

  if (areaSqm < 500) {
    const polygon = await Polygon.create({
      land: land._id,
      geoJson: {},
      areaSqm,
      skipped: true,
      source: source || 'user_drawn'
    });

    logger.info('Polygon skipped — area under 500sqm', { landId: land._id, areaSqm });
    return res.json({ success: true, polygon, skipped: true });
  }

  // Validate GeoJSON
  validateGeoJson(geoJson);

  // Compute polygon area using Turf.js
  let computedArea = 0;
  if (turfArea && geoJson.type === 'Feature') {
    computedArea = turfArea(geoJson);
  } else if (turfArea && geoJson.type === 'Polygon') {
    computedArea = turfArea({ type: 'Feature', geometry: geoJson, properties: {} });
  }

  // Pin GeoJSON to IPFS
  const geoCID = await ipfsPinService.pinBuffer(Buffer.from(JSON.stringify(geoJson)));

  // Generate warnings
  const warnings = [];

  // Area mismatch check (±10%)
  if (computedArea > 0 && areaSqm > 0) {
    const diff = Math.abs(computedArea - areaSqm);
    const tolerance = areaSqm * 0.10;
    if (diff > tolerance) {
      warnings.push({
        type: 'area_mismatch',
        severity: diff > areaSqm * 0.25 ? 'critical' : 'warning',
        message: `Polygon area (${Math.round(computedArea)} sqm) differs from declared area (${Math.round(areaSqm)} sqm) by ${Math.round(diff)} sqm`,
        data: { computedArea, declaredArea: areaSqm, diffPercent: Math.round((diff / areaSqm) * 100) }
      });
    }
  }

  const polygon = await Polygon.create({
    land: land._id,
    geoJson,
    areaSqm: computedArea || areaSqm,
    source: source || 'user_drawn',
    ipfsCID: geoCID,
    warnings,
    skipped: false
  });

  // Update land with polygon CID
  land.documents.polygonGeoJsonCID = geoCID;
  await land.save();

  logger.info('Polygon saved', { landId: land._id, cid: geoCID, warnings: warnings.length });

  res.json({ success: true, polygon });
});

/**
 * GET /land/:id/polygon
 */
exports.getPolygon = asyncHandler(async (req, res) => {
  const polygon = await Polygon.findOne({ land: req.params.id }).sort({ createdAt: -1 });

  if (!polygon) {
    return res.status(404).json({ success: false, error: 'No polygon found' });
  }

  res.json({ success: true, polygon });
});

/**
 * POST /land/:id/polygon/validate
 * Run spatial validation checks on the polygon.
 */
exports.validatePolygon = asyncHandler(async (req, res) => {
  const polygon = await Polygon.findOne({ land: req.params.id }).sort({ createdAt: -1 });

  if (!polygon || polygon.skipped) {
    return res.json({ success: true, skipped: true, message: 'Polygon skipped or not found' });
  }

  // Check for overlaps with other polygons (advisory only)
  const otherPolygons = await Polygon.find({
    land: { $ne: req.params.id },
    skipped: false
  }).limit(100);

  const warnings = [...polygon.warnings];

  // Note: Full overlap detection would use @turf/boolean-overlap
  // For now, we log as advisory
  if (otherPolygons.length > 0) {
    logger.info('Spatial check: comparing against existing polygons', {
      count: otherPolygons.length
    });
  }

  res.json({
    success: true,
    polygon,
    warnings,
    advisoryOnly: true
  });
});
