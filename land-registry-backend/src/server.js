const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const logger = require('./utils/logger');

const app = express();

// ── Security & Parsing ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URI || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ──────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Health Check ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API v1 Routes ──────────────────────────────────────────────────
app.use('/api/v1/auth', require('./api/v1/routes/auth.routes'));
app.use('/api/v1/profile', require('./api/v1/routes/profile.routes'));
app.use('/api/v1/land', require('./api/v1/routes/land.routes'));
app.use('/api/v1/land', require('./api/v1/routes/coowner.routes'));   // /land/:id/coowners
app.use('/api/v1/land', require('./api/v1/routes/polygon.routes'));   // /land/:id/polygon
app.use('/api/v1/ipfs', require('./api/v1/routes/ipfs.routes'));
app.use('/api/v1/verification', require('./api/v1/routes/verification.routes'));
app.use('/api/v1/officer', require('./api/v1/routes/officer.routes'));
app.use('/api/v1/transfer', require('./api/v1/routes/transfer.routes'));
app.use('/api/v1/escrow', require('./api/v1/routes/escrow.routes'));
app.use('/api/v1/notifications', require('./api/v1/routes/notification.routes'));
app.use('/api/v1/webhook', require('./api/v1/routes/webhook.routes'));

// ── 404 Handler ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global Error Handler ───────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`🚀 Land Registry Server running on port ${PORT}`);
    logger.info(`📡 API base: http://localhost:${PORT}/api/v1`);
  });
}).catch(err => {
  logger.error('Failed to connect to database', { error: err.message });
  process.exit(1);
});

module.exports = app;