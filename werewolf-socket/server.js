const io = require('socket.io')();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/werewolfdb";


io.on('connection', (socket) => {
  socket.on('start-game', () => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let myobj = { creator: socket.id, partecipants: [socket.id] };
      db.collection("games").insertOne(myobj, function(err, res) {
        if (err) throw err;
        socket.join(res.insertedId);
        socket.emit('join', res.insertedId);
        io.in(room).emit('welcome', socket.id);
        db.close();
      });
    });
  });

  socket.on('join-game', (room) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let query = { _id: room };
      let update = { $push: {partecipants: socket.id } };
      db.collection("games").update(query, update, function(err, res) {
        if (err) throw err;
        socket.join(room);
        io.in(room).emit('welcome', socket.id);
        db.close();
      });
    });
  });

  socket.on('leave-game', (room) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let query = { _id: room };
      let update = { $pull: {partecipants: socket.id } };
      db.collection("games").update(query, update, function(err, res) {
        if (err) throw err;
        io.in(room).emit('farewell', socket.id);
        socket.leave(room);
        db.close();
      });
    });
  });

  socket.on('play', (room) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let query = { _id: room };
      db.collection("games").findOne(query, function(err, res) {
        if (err) throw err;
        let partecipants = res.partecipants;
        assignRoles(partecipants);
        let update = { $push: { each: {roles: partecipants} } };
        db.collection("games").update(query, update, function(err, res) {
          if (err) throw err;
          for (var partecipant in partecipants) {
            io.to(partecipant.id).emit('role', partecipant.role);
          }
          db.close();
        });
      });
    });
  });

  socket.on('next', (room) => {
    socket.join(room);
    socket.broadcast.to(room).emit('new','si è aggiunto un nuovo utente id: ' + socket.id);
  });
});

const port = 8000;
io.listen(port);

const roles = [
  'lupo'
 ,'contadino'
 ,'contadino'
 ,'guardia'
 ,'guardia'
 ,'contadino'
 ,'lupo'
 ,'veggente'
 ,'contadino'
 ,'guardia'
 ,'medium'
 ,'lupo'
 ,'druido'
 ,'contadino'
 ,'guaritore'
 ,'guardia'
 ,'lupo'
 ,'meretrice'
 ,'becchino'
 ,'contadino'
 ,'figlio dei lupi'
 ,'contadino'
 ,'guardia'
 ,'contadino'
 ,'figlio dei lupi'
];
function assignRoles(partecipants){
  shuffleArray(partecipants);
  for (let i = 0; i < partecipants.length; i++){
    partecipants[i].role = roles[i];
  }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
