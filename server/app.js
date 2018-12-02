var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

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

app.use('/user', user_router);
app.use('/chat', chat_router);
app.use('/post', post_router);
app.use('/friend', friend_router);

app.listen(port, () => console.log(`Listening on port ${port}`));