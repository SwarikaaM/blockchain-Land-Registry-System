const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification.model');

/**
 * GET /notifications
 * Get current user's notifications (paginated, newest first).
 */
exports.list = asyncHandler(async (req, res) => {
  const filter = { user: req.userId };
  if (req.query.unread === 'true') filter.read = false;

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter)
  ]);

  const unreadCount = await Notification.countDocuments({ user: req.userId, read: false });

  res.json({
    success: true,
    notifications,
    unreadCount,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

/**
 * PUT /notifications/:id/read
 */
exports.markRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: { read: true } },
    { new: true }
  );

  if (!notif) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }

  res.json({ success: true, notification: notif });
});

/**
 * PUT /notifications/read-all
 */
exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.userId, read: false },
    { $set: { read: true } }
  );

  res.json({ success: true, message: 'All notifications marked as read' });
});
