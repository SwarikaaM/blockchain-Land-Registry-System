exports.validate = (geo) => {
  if (!geo.type || !geo.coordinates) {
    throw new Error('Invalid GeoJSON');
  }
  return true;
};