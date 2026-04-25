const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // نقوم بمحاولة قراءة المفتاح من متغيرات البيئة
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    serviceAccount = null;
  }
} catch (error) {
  console.error("خطأ: لم يتم العثور على FIREBASE_SERVICE_ACCOUNT أو التنسيق غير صحيح.");
  serviceAccount = null;
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} else {
  console.warn("تحذير: لم يتم تفعيل Firebase Admin SDK بسبب فقدان الإعدادات.");
}

const sendPushNotification = async (token, title, body, data = {}) => {
  const message = { notification: { title, body }, data, token };
  return admin.messaging().send(message);
};

module.exports = { admin, sendPushNotification };