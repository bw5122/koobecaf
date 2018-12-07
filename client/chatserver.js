var path = require('path');
var express = require('express');
var app = express();
var server =require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/')))

// id of new chat room waiting to be created
var newChatid = 0;
// 在线用户
var onlineUsers = {};
// 在线用户人数
var onlineCount = 0;

//socket nsp to transfer chatid

io.on('connection', function(socket) {
  //  socket.join(newChatid);
    console.log("a user is connected to chat room: "+socket.handshake.query.chatid);
    socket.join(socket.handshake.query.chatid);

    //getChatHistory()???

    // 监听客户端的登陆
    socket.on('login', function(obj){
        // 用户id设为socketid
        socket.id = obj.uid;
        //join the assigned chat room according to chatid
        console.log('before socket.join, chat id: '+obj.chatid);
        // 如果没有这个用户，那么在线人数+1，将其添加进在线用户
        if (!onlineUsers.hasOwnProperty(obj.uid)) {
            onlineUsers[obj.uid] = obj.username;
            onlineCount++;
        }

        // 向客户端发送登陆事件，同时发送在线用户、在线人数以及登陆用户
        //io.sockets.in(obj.chatid).emit('connectToRoom', roomno);
        console.log("login emit chatid: "+obj.chatid);
        io.in(obj.chatid).emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        console.log(obj.username+'加入了群聊');
    })

    // 监听客户端的断开连接
    socket.on('disconnect', function() {

        // 如果有这个用户
        if(onlineUsers.hasOwnProperty(socket.id)) {
            var obj = {uid:socket.id, username:onlineUsers[socket.id]};

            // 删掉这个用户，在线人数-1
            delete onlineUsers[socket.id];
            onlineCount--;

            // 向客户端发送登出事件，同时发送在线用户、在线人数以及登出用户
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.username+'退出了群聊');
        }
    })

    // 监听客户端发送的信息
    socket.on('message', function(obj){
      console.log("chatid: "+obj.chatid);
        //io.to(obj.chatid).emit('message', obj);//successful?
        //io.in(obj.chatid).emit('message', obj);

        obj.author = "them";
        socket.broadcast.to(obj.chatid).emit('message', obj);
        //uploadmsg()
        console.log(obj.username+"说:"+ obj.message)
    })

})

server.listen(3300, function(err) {
    console.log('Listening at *:3300');
})
