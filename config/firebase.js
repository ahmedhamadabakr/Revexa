const admin = require('firebase-admin');

let serviceAccount;
try {
  let saConfig = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (saConfig) {
    // إزالة علامات الاقتباس الزائدة إذا وجدت في بداية ونهاية النص
    saConfig = saConfig.trim();
    if ((saConfig.startsWith("'") && saConfig.endsWith("'")) || (saConfig.startsWith('"') && saConfig.endsWith('"'))) {
      saConfig = saConfig.slice(1, -1);
    }
    serviceAccount = JSON.parse(saConfig);
  } else {
    serviceAccount = null;
  }
} catch (error) {
  console.error("Firebase Config Error (JSON Parsing):", error.message);
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // تنبيه المستخدم إذا كان النص يحتوي على علامات اقتباس مفردة بدلاً من المزدوجة
    const hasSingleQuotes = process.env.FIREBASE_SERVICE_ACCOUNT.includes("'");
    if (hasSingleQuotes) console.error("تنبيه: يبدو أن النص يحتوي على علامات اقتباس مفردة ('). JSON يتطلب علامات مزدوجة (\").");
  }
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