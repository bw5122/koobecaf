var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

//app.use(express.logger("default"));

app.use(cookieParser());
app.use(session({
    secret: 'thisIsMySecret'
}));

// routers
var user_router = require('./routers/user');
var chat_router = require('./routers/chat');
var post_router = require('./routers/post');
var friend_router = require('./routers/friend');

var chat_ctrl = require('./controllers/chat');

app.use('/user', user_router);
app.use('/chat', chat_router);
app.use('/post', post_router);
app.use('/friend', friend_router);


// id of new chat room waiting to be created
var newChatid = 0;
// 在线用户
var onlineUsers = {};
// 在线用户人数
var onlineCount = 0;

io.on('connection', function(socket) {
    //  socket.join(newChatid);
    console.log("a user is connected to chat room: " + socket.handshake.query.chatID);
    socket.join(socket.handshake.query.chatID);
    console.log(typeof(socket.handshake.query.chatID));

    //getChatHistory()???
    chat_ctrl.get_chat_history(socket.handshake.query.chatID, function(data) {
        console.log(data);
    });

    // 监听客户端的登陆
    socket.on('login', function(obj) {
        // 用户id设为socketid
        socket.id = obj.uid;
        //join the assigned chat room according to chatid
        console.log('before socket.join, chat id: ' + obj.chatid);
        // 如果没有这个用户，那么在线人数+1，将其添加进在线用户
        if (!onlineUsers.hasOwnProperty(obj.uid)) {
            onlineUsers[obj.uid] = obj.username;
            onlineCount++;
        }

        // 向客户端发送登陆事件，同时发送在线用户、在线人数以及登陆用户
        //io.sockets.in(obj.chatid).emit('connectToRoom', roomno);
        console.log("login emit chatid: " + obj.chatid);
        io.in(obj.chatid).emit('login', {
            onlineUsers: onlineUsers,
            onlineCount: onlineCount,
            user: obj
        });
        console.log(obj.username + '加入了群聊');
    })

    // 监听客户端的断开连接
    socket.on('disconnect', function() {

        // 如果有这个用户
        if (onlineUsers.hasOwnProperty(socket.id)) {
            var obj = {
                uid: socket.id,
                username: onlineUsers[socket.id]
            };

            // 删掉这个用户，在线人数-1
            delete onlineUsers[socket.id];
            onlineCount--;

            // 向客户端发送登出事件，同时发送在线用户、在线人数以及登出用户
            io.emit('logout', {
                onlineUsers: onlineUsers,
                onlineCount: onlineCount,
                user: obj
            });
            console.log(obj.username + '退出了群聊');
        }
    })

    // 监听客户端发送的信息
    socket.on('message', function(message) {
        console.log("chatid: " + message.chatID);
        //io.to(obj.chatid).emit('message', obj);//successful?
        //io.in(obj.chatid).emit('message', obj);
        console.log(message);
        //upload message
        message.data = JSON.stringify(message.data);
        chat_ctrl.add_message(message, function(data) {
            console.log("add_message call back: "+data);
        })
        console.log("send message event from server");
        console.log(typeof(message.chatID));
        console.log(message.chatID);
        socket.broadcast.to(message.chatID).emit('message', message);
        //uploadmsg()
        console.log(message.sender + "说:" + message.data);
    })

})

http.listen(port, () => console.log(`Listening on port ${port}`));
