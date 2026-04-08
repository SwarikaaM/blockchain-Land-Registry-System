exports.validateFile = (file) => {
  if (!file) throw new Error('File required');
  if (!file.mimetype.includes('pdf')) throw new Error('Only PDF allowed');
};