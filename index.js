var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const url = require('url');
users = [];
connections = [];
rooms = [];
persons = [];
http.listen(port, function(){
  console.log('listening on port ' + port + ', time to... try not to fail...');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/science', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});
app.get('/about', function(req, res){
  res.sendFile(__dirname + '/about.html');
});





var i = 0;
var j = 0;
//CHAT SYSTEM 

io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s people connected', connections.length);
  socket.on('disconnect', function(data){
    io.sockets.emit('user disconnect', { user : socket.username});
    var ed = users.indexOf(socket.username);
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket)  , 1);
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
    users[j] = [socket.username, room];
    j++;
    updateUsernames(room);
    console.log("One weirdko named themselves "+ socket.username);
  });

  socket.on('create room', function(name){
    app.get('/'+name, function(req, res){
    res.sendFile(__dirname + '/chat.html');
  });
    rooms[i] = name;
    i++;
    socket.emit('get rooms', rooms);
    console.log("Room "+name+" made !");
  });
  socket.on('request rooms', function(){
    socket.emit('get rooms', rooms);
    console.log(rooms);
  });
  socket.on('request users', function(room){
    target = room;
    socket.emit('get users', users, target);
  });
  function updateUsernames(room){
    var target = room;
    io.sockets.emit('get users', users, target);
    console.log(users);
  }
});

