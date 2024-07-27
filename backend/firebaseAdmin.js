const admin = require('firebase-admin');
const serviceAccount = require('./notification-1dc26-firebase-adminsdk-swe90-6bbb00fa62.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://notification-1dc26.firebaseio.com'
});

module.exports = admin;
