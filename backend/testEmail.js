require('dotenv').config();
const { sendEmails } = require('./notification'); 

sendEmails().then(() => {
  console.log('Emails sent successfully!');
}).catch(error => {
  console.error('Error sending emails:', error);
});
