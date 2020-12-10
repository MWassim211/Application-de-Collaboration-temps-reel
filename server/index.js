const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

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

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 };
    const numberOfClients = roomClients.length;

    // These events are emitted only to the sender socket.
    if (numberOfClients === 0) {
      console.log(`Creating room ${roomId} and emitting room_created socket event`);
      socket.join(roomId);
      socket.emit('room_created', roomId);
    } else if (numberOfClients === 1) {
      console.log(`Joining room ${roomId} and emitting room_joined socket event`);
      socket.join(roomId);
      socket.emit('room_joined', roomId);
    } else {
      console.log(`Can't join room ${roomId}, emitting full_room socket event`);
      socket.emit('full_room', roomId);
    }
  });

  // These events are emitted to all the sockets connected to the same room except the sender.
  socket.on('start_call', (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`);
    socket.broadcast.to(roomId).emit('start_call');
  });
  socket.on('webrtc_offer', (event) => {
    console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`);
    socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp);
  });
  socket.on('webrtc_answer', (event) => {
    console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`);
    socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp);
  });
  socket.on('webrtc_ice_candidate', (event) => {
    console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`);
    socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(port);
console.log(`Listening on: ${port}`);
