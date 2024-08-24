// Import necessary modules
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Ensure path matches your file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount) // Use service account to authenticate
});

// Define the route to send notifications
app.post('/send-notification', (req, res) => {
  const { token, title, body } = req.body; // Extract token, title, and body from request

  // Create the message payload
  const message = {
    token: token,
    notification: {
      title: title,
      body: body
    }
  };

  // Send the notification using Firebase Cloud Messaging API V1
  admin.messaging().send(message)
    .then(response => {
      res.status(200).send(`Notification sent successfully: ${response}`);
    })
    .catch(error => {
      res.status(500).send(`Error sending notification: ${error}`);
    });
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
