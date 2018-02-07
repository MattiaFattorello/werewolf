import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');


function start(cb) {
  socket.on('welcome', msg => cb(null, 'welcome', msg));
  socket.on('join', msg => cb(null, 'join', msg));
  socket.on('farewell', msg => cb(null, 'farewell', msg));
  socket.on('role', msg => cb(null, 'role', msg));
  //socket.on('join', msg => cb(null, 'join', msg));

  socket.emit('start-game', '');
}

function leave(room) {
  socket.emit('leave', room);
}

function join(room, cb) {
  //socket.on('new', msg => cb(null, msg));
  socket.on('welcome', msg => cb(null, 'welcome', msg));
  socket.on('join', msg => cb(null, 'join', msg));
  socket.on('farewell', msg => cb(null, 'farewell', msg));
  socket.on('role', msg => cb(null, 'role', msg));
  socket.emit('join-game', room );
}

function play(room) {
  socket.emit('play', room);
}

function next(room) {
  socket.emit('next', room);
}


export { subscribe, leaveRoom, joinRoom, setUsername };


start-game
join-game
leave-game
play
next
