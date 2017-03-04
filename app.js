"use strict"

var settings = require('./settings');
var path = require('path');
var express = require("express");
var app = express();
var http = require('http')
var chat = require('./lib/chat');
var chat_input = require('./routes/input');
var chat_main = require('./routes/chat');

app.set('env', settings.env || 'development');
var port = settings.port || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',chat_input);
app.use('/chat',chat_main);

var server = http.createServer(app);
chat(server);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});