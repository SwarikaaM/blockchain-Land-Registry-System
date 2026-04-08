module.exports = (a, b) => {
  if (!a || !b) return 0;

  a = a.toLowerCase();
  b = b.toLowerCase();

  let match = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) match++;
  }

  return match / Math.max(a.length, b.length);
};