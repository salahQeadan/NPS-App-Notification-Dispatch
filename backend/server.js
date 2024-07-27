const http = require('http');
const admin = require('./firebaseAdmin');
//
const { sendEmails } = require('./notification');
//
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/addUser' && req.method === 'GET') {
    const db = admin.firestore();
    db.collection('users').add({
      name: 'Majd Shadafny',
      email: 'majodeshadafny@gmail.com'
    }).then(docRef => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Document written with ID: ' + docRef.id }));
}).catch(error => {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Error adding document: ' + error }));
});

//
} else if (req.url === '/send-emails' && req.method === 'GET') {
  sendEmails().then(() => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Emails sent successfully!' }));
  }).catch(error => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Error sending emails: ' + error }));
  });
  //
} else {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
}
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
