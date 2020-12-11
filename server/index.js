const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/mypeer',
});

app.use(peerServer);

const DIST_DIR = path.join(__dirname, '../dist');
// const HTML_FILE = path.join(DIST_DIR, 'index.html');
// Pour que Express trouve plus tard son chemin “de base”
// et les fichiers statiques générés par Webpack
app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(port);
console.log(`Listening on: ${port}`);
