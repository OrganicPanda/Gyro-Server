'use strict';

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

server.listen(3000);

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
  res.render('client.html');
});

io.sockets.on('connection', function(socket) {
  socket.on('setPseudo', function(data) {
    socket.set('pseudo', data);
  });

  socket.on('message', function(message) {
    socket.get('pseudo', function(error, name) {
      var data = { 'message' : message, pseudo : name };
      socket.broadcast.emit('message', data);
      //console.log('user ' + name + ' send this : ' + message);
    });
  });
});