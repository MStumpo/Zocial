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
  res.sendFile(__dirname + '/index.html');
});

app.get('/science', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});
/*
app.get('/programming', function(req, res){
  res.sendFile(__dirname + '/chat2.html');
});

app.get('/normal-people', function(req, res){
  res.sendFile(__dirname + '/chat3.html');
});
*/
app.get('/about', function(req, res){
  res.sendFile(__dirname + '/about.html');
});






//CHAT SYSTEM 

io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s people connected', connections.length);
  socket.on('disconnect', function(data){
    io.sockets.emit('user disconnect', { user : socket.username});
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('An arse left');
    console.log('Connected: %s people connected', connections.length);
  });

  socket.on('message', function(data, room){
    var target = room; 
    io.sockets.emit('message', {msg : data, user: socket.username}, target);
    console.log(socket.username + ' --> ' + data);
  });

  socket.on('new user', function(data, room){
    socket.username = data;
    users.push(socket.username);
    updateUsernames(data, room);
    console.log("One weirdo named themselves "+ socket.username);
    console.log(users);
  });

  socket.on('create room', function(name){
    app.get('/'+name, function(req, res){
    res.sendFile(__dirname + '/chat.html');
  });
    console.log("Room "+name+" made!");
  });
  function updateUsernames(data, room){
    var target = room;
    io.sockets.emit('get users', data, target);
  }
});

