/**
 * Area conversion utilities for Maharashtra land units.
 *
 * Standard conversions:
 * 1 hectare = 10,000 sqm
 * 1 acre = 4,046.86 sqm
 * 1 guntha = 101.17 sqm (Maharashtra standard)
 * 1 acre = 40 guntha
 */

const CONVERSION = {
  sqm: 1,
  hectare: 10000,
  acre: 4046.86,
  guntha: 101.17
};

/**
 * Convert area from one unit to another.
 * @param {number} value - Area value
 * @param {string} from - Source unit (sqm, hectare, acre, guntha)
 * @param {string} to - Target unit
 * @returns {number} Converted value
 */
exports.convert = (value, from, to) => {
  if (!CONVERSION[from] || !CONVERSION[to]) {
    throw new Error(`Unknown unit: ${from} or ${to}. Valid: ${Object.keys(CONVERSION).join(', ')}`);
  }
  const sqm = value * CONVERSION[from];
  return sqm / CONVERSION[to];
};

/**
 * Convert to sqm from any unit.
 */
exports.toSqm = (value, unit) => {
  return exports.convert(value, unit, 'sqm');
};

/**
 * Get all conversions for a given area.
 */
exports.allUnits = (value, unit) => {
  const sqm = exports.toSqm(value, unit);
  return {
    sqm: Math.round(sqm * 100) / 100,
    hectare: Math.round((sqm / CONVERSION.hectare) * 10000) / 10000,
    acre: Math.round((sqm / CONVERSION.acre) * 10000) / 10000,
    guntha: Math.round((sqm / CONVERSION.guntha) * 100) / 100
  };
};
