var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

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
	 console.log('A new weirdo just joined');
  // socket.username = "Completely average person";
   //socket.on('change_username', function(data){
    //socket.username = data.username;
  //});
  socket.on('disconnect', function(){
    console.log('Aaaand someone left :(');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

});

http.listen(port, function(){
  console.log('listening on port ' + port + ', time to... try not to fail...');
});