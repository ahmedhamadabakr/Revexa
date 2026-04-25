const admin = require('firebase-admin');

let serviceAccount;
try {
  let saConfig = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (saConfig) {
    // Remove extra quotes if found at the start and end of the text
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
    // Warn the user if the text contains single quotes instead of double quotes
    const hasSingleQuotes = process.env.FIREBASE_SERVICE_ACCOUNT.includes("'");
    if (hasSingleQuotes) console.error("Warning: The text seems to contain single quotes ('). JSON requires double quotes (\").");
  }
  serviceAccount = null;
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK initialized successfully.");
} else {
  console.warn("Warning: Firebase Admin SDK not activated due to missing settings.");
}

const sendPushNotification = async (token, title, body, data = {}) => {
  const message = { notification: { title, body }, data, token };
  return admin.messaging().send(message);
};

module.exports = { admin, sendPushNotification };