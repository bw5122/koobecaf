// MODE
const MODE = "DEV";

// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (MODE != 'DEV' && cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function(worker) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

    // Code to run if we're in a worker process
} else {
    var express = require('express');
    var app = express();
    var port = process.env.PORT || 5000;
    var path = require('path');
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var session = require("express-session"),
        bodyParser = require("body-parser");


    app.use(express.static("public"));
    app.use(bodyParser.json({
        limit: '10mb',
        extended: true
    }));
    app.use(bodyParser.urlencoded({
        limit: '10mb',
        extended: true
    }));
    app.use(session({
        secret: "cats"
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, '/build')));


    var SHA3 = require("crypto-js/sha3");
    var userTable = require('./models/user.js');
    passport.use(new LocalStrategy(
        function(username, password, done) {
            console.log(username, password);
            userTable.findUser({
                username: username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (SHA3(password).toString() !== user.password) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        }
    ));


    passport.serializeUser(function(user, done) {
        if (user) {
            done(null, user.userID);
        }
    });

    passport.deserializeUser(function(id, done) {
        userTable.getInfo(id, function(err, user) {
            done(err, user);
        });
    });

    /* for user login */
    app.post('/login', function(req, res, next) {
        console.log('server login:')
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                res.send({
                    error: err,
                    data: null,
                });
            }
            if (!user) {
                res.send({
                    error: info,
                    data: null,
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                return res.send({
                    data: user,
                    error: null,
                });
            });
        })(req, res, next);
    })

    app.get('/logout', function(req, res) {
        req.logout();
        res.send({
            error: null,
            data: 'Bye!'
        })
    });

    // routers
    var user_router = require('./routers/user');
    var chat_router = require('./routers/chat');
    var post_router = require('./routers/post');
    var friend_router = require('./routers/friend');
    var test_router = require('./routers/test');
    var notice_router = require('./routers/notice');


    var chat_ctrl = require('./controllers/chat');

    app.use('/user', user_router);
    app.use('/chat', chat_router);
    app.use('/post', post_router);
    app.use('/friend', friend_router);
    app.use('/test', test_router);
    app.use('/notice', notice_router);


    io.on('connection', function(socket) {
        console.log("a user is connected to chat room: " + socket.handshake.query.chatID);
        socket.join(socket.handshake.query.chatID);
        /*chat_ctrl.get_chat_history(socket.handshake.query.chatID, function(data) {
            console.log(data);
            io.to(socket.id).emit('history', data);
        });*/

        // 监听客户端的断开连接
        socket.on('disconnect', function() {
            console.log("a user is disconncted");
        })

        // 监听客户端发送的信息
        socket.on('message', function(message) {
            console.log("message is received");
            console.log("chatid: " + message.chatID);
            //io.to(obj.chatid).emit('message', obj);//successful?
            //io.in(obj.chatid).emit('message', obj);
            console.log(message);

            //upload message
            delete message['author'];
            delete message['firstname'];
            message.data = JSON.stringify(message.data);
            chat_ctrl.add_message(message, function(data) {
                console.log("add_message call back: " + data);
            })
            console.log("send message event from server");
            console.log(typeof(message.chatID));
            console.log(message.chatID);
            socket.broadcast.to(message.chatID).emit('message', message);
            console.log(message.sender + "说:" + message.data);
        })

    })

    http.listen(port, () => console.log(`Listening on port ${port}`));
}