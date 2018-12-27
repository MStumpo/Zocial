var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const url = require('url');
users = [];
connections = [];

http.listen(port, function(){
  console.log('listening on port ' + port + ', time to... try not to fail...');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/views/chat.html');
});

app.get('/about', function(req, res){
  res.sendFile(__dirname + '/views/about.html');
});



//CHAT SYSTEM 

io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s people connected', connections.length);
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('An arse left');
    console.log('Connected: %s people connected', connections.length);
  });

  socket.on('message', function(data){ 
    io.sockets.emit('message', {msg : data, user: socket.username});
    console.log(socket.username + ' --> ' + data);
  });

  socket.on('new user', function(data, callback){
    if(callback) callback(true);
    socket.username = data;
    users.push(socket.username);
    io.sockets.emit('get users', {users: data});
    console.log("One weirdo named themselves "+ socket.username);
  });
  function updateUsernames(){
        io.sockets.emit('get users', users);
  }
});

