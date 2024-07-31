const http = require('http');
const admin = require('./firebaseAdmin');
const { parse } = require('url');
const { sendEmails } = require('./notification');


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const reqUrl = parse(req.url, true);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

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
  }
  else if (req.method === 'POST' && reqUrl.pathname === '/token') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body);
        console.log('Token received:', jsonData.token);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Token received successfully' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
