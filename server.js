var app = require('express')();
let server = require('http').Server(app)
let io = require('socket.io')(server);

// Set port for listening
app.set('port',(process.env.PORT || 3000));

// Defining test return
app.get('/hello', function(req, resp) {
  resp.send('<h1>Hello, World!</h1>');
});

// Define response for homepage
app.get('/', function(req, resp) {
  resp.sendFile(__dirname+'/index.html');
});

users = [];
msgs = [];
var msgs_length = 0;
let user_by_id = {};

function isAlive() {
}; 

io.on('connection', function(socket) {
  console.log('A user has connected '+socket.id);
  for(let i=0; i<users.length; i++) {
    console.log(users);
    socket.emit('new-user', users[i]);
  }
  for(let j=0; j<msgs.length; j++) {
    socket.emit('got-a-text', msgs[j]);
  };
  socket.on('disconnect', function() {
    console.log('Disconnect by client '+socket.id); 
    let disc_user = user_by_id[socket.id];
    if (disc_user !== undefined) {
      io.emit('a-user-disc', disc_user);
      console.log('DISC user '+disc_user);
      users.splice(users.indexOf(disc_user),1);
    }
  });
  socket.on('got-a-text', function(msg) {
    console.log('Messgae: ' + msg);
    msgs.push(msg);
    msgs_length += 1;
    if (msgs_length > 200) {
      msgs.shift();
      msgs_length -= 1;
    }
    io.emit('got-a-text', msg);
  });
  socket.on('new-user', function(msg) {
    console.log('New Nick: ' + msg);
    io.emit('new-user', msg);
    user_by_id[socket.id] = msg;
    users.push(msg);
  });
});

server.listen(app.get('port'), function() {
    console.log('Chat server listening on port: '+app.get('port'));
});