require('dotenv').config();
const twilio = require('twilio');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const fromWahtsappNumber = process.env.TWILIO_FROM_WHATSAPP_NUMBER;
const smsRecipients = process.env.TWILIO_SMS_RECIPIENTS.split(',');
const whatsappRecipients = process.env.TWILIO_WHATSAPP_RECIPIENTS.split(',');
const voiceRecipients = process.env.TWILIO_VOICE_RECIPIENTS.split(',');
const twimlUrl = process.env.TWIML_URL; 

const client = twilio(accountSid, authToken);

const MessageBody = 'Hi, please fill the form again. Thank you!';

// Function to send SMS messages to a list of recipients
const sendSMSMessages = (recipients) => {
    recipients.forEach(toNumber => {
        client.messages
            .create({
                body: MessageBody,
                from: fromNumber,
                to: toNumber.trim()  // Trim to remove any extra whitespace
            })
            .then(message => console.log(`SMS sent to ${toNumber} with SID: ${message.sid}`))
            .catch(error => {
                if (error.code === 21608) {
                    console.error(`Error sending SMS to ${toNumber}: The number is unverified. Verify at twilio.com`);
                } else {
                    console.error(`Failed to send SMS to ${toNumber}:`, error);
                    if (error.code) {
                        console.error(`Error code: ${error.code}`);
                        console.error(`Error message: ${error.message}`);
                    }
                }
            });
    });
};

// Function to send WhatsApp messages to a list of recipients
const sendWhatsAppMessages = (recipients) => {
    recipients.forEach(toNumber => {
        client.messages
            .create({
                body: MessageBody,
                from: `whatsapp:${fromWahtsappNumber}`,
                to: `whatsapp:${toNumber.trim()}`  
            })
            .then(message => console.log(`WhatsApp message sent to ${toNumber} with SID: ${message.sid}`))
            .catch(error => {
                console.error(`Failed to send WhatsApp message to ${toNumber}:`, error);
                if (error.code) {
                    console.error(`Error code: ${error.code}`);
                    console.error(`Error message: ${error.message}`);
                }
            });
    });
};

// Function to make voice calls to a list of recipients
const makeVoiceCalls = (recipients) => {
    recipients.forEach(async (toNumber) => {
        try {
            const call = await client.calls.create({
                url: twimlUrl,  
                to: toNumber.trim(),  
                from: fromNumber 
            });
            console.log(`Call to ${toNumber} initiated. Call SID: ${call.sid}`);
        } catch (error) {
            console.error(`Failed to call ${toNumber}:`, error);
        }
    });
};

// Function to send emails to a list emails
const sendEmails = async () => {
  const url = process.env.MONGO_URL;
  const dbName = 'customers';
  const client = new MongoClient(url);

  try {
      await client.connect();
      console.log('Connected to MongoDB');
      const db = client.db(dbName);
      const collection = db.collection('emaildata');

      const customers = await collection.find({}).toArray();
      console.log('Customers:', customers);

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });
      for (const customer of customers) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customer.email,
            subject: 'رسالة ترحيب',
            text: `مرحبًا ${customer.name}, شكراً لتسجيلك معنا!`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${customer.email}`);
    }
} catch (error) {
    console.error('Error:', error);
} finally {
    await client.close();
}
};

sendEmails();

sendSMSMessages(smsRecipients);

sendWhatsAppMessages(whatsappRecipients);

makeVoiceCalls(voiceRecipients);

// Export the functions
module.exports = {
  sendSMSMessages,
  sendWhatsAppMessages,
  makeVoiceCalls,
  sendEmails,
};