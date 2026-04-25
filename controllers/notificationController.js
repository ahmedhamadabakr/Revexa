const Notification = require('../models/Notification');
const User = require('../models/user.model'); // تأكد من المسار الصحيح لموديل المستخدم
const { sendPushNotification, admin } = require('../config/firebase');
const { z } = require('zod');

const notificationSchema = z.object({
  userId: z.string(),
  fcmToken: z.string().optional(), // اختياري، لو لم يرسل سنجلبه من الـ DB
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string()).optional(),
});

const sendToUser = async (req, res) => {
  try {
    const validatedData = notificationSchema.parse(req.body);
    let { userId, fcmToken, title, body, data } = validatedData;

    // إذا لم يتم إرسال التوكن، نبحث عنه في قاعدة البيانات
    if (!fcmToken) {
      const user = await User.findById(userId);
      if (!user || !user.fcmToken) {
        return res.status(404).json({ error: 'المستخدم ليس لديه توكن مسجل (FCM Token)' });
      }
      fcmToken = user.fcmToken;
    }

    // 1. Send via Firebase
    await sendPushNotification(fcmToken, title, body, data);

    // 2. Save to Database
    const newNotification = new Notification({
      recipient: userId,
      title,
      body,
      data
    });
    await newNotification.save();

    res.status(200).json({ success: true, message: 'Notification sent and saved' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Notification Error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

module.exports = { sendToUser };