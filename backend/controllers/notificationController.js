import Notification from '../models/Notification.js';

// Helper function to create and send real-time notification
export const createNotification = async (req, { recipient, title, message, type, link }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender: req.user?._id || recipient, // system can be sender
      type,
      title,
      message,
      link
    });

    const populated = await notification.populate('sender', 'name profilePicture');

    // Emit via Socket.io if user is online
    const socketId = req.userSockets?.get(recipient.toString());
    if (socketId) {
      req.io.to(socketId).emit('new_notification', populated);
    }

    return populated;
  } catch (error) {
    console.error('Notification Error:', error);
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark individual as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
    if (notification.recipient.toString() !== req.user._id.toString()) return res.status(403).json({ success: false });

    notification.read = true;
    await notification.save();
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Not found' });
    if (notification.recipient.toString() !== req.user._id.toString()) return res.status(403).json({ success: false });

    await notification.deleteOne();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};
