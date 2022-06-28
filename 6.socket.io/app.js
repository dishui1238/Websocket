var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(__dirname)) // 当前目录作为静态文件目录

// 创建一个服务器
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// 监听客户端的连接事件
io.on('connection', function (socket) {
  console.log('客户端已经连接');
  socket.on('message', function (msg) {
      console.log(msg);
      socket.send('sever:' + msg);
  });
});

server.listen(3000);