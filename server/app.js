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
var test_router = require('./routers/test');

var chat_ctrl = require('./controllers/chat');

app.use('/user', user_router);
app.use('/chat', chat_router);
app.use('/post', post_router);
app.use('/friend', friend_router);
app.use('/test', test_router);

// id of new chat room waiting to be created
var newChatid = 0;
// 在线用户
var onlineUsers = {};
// 在线用户人数
var onlineCount = 0;

io.on('connection', function(socket) {
    console.log("a user is connected to chat room: " + socket.handshake.query.chatID);
    socket.join(socket.handshake.query.chatID);
    chat_ctrl.get_chat_history(socket.handshake.query.chatID, function(data) {
        console.log(data);
        io.to(socket.id).emit('history', data);
    });

    // 监听客户端的断开连接
    socket.on('disconnect', function() {
      console.log("a user is disconncted");
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
        console.log(message.sender + "说:" + message.data);
    })

})

http.listen(port, () => console.log(`Listening on port ${port}`));
