var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//app.use(express.logger("default"));

app.use(cookieParser());
app.use(session({
    secret: 'thisIsMySecret'
}));

var chat_ctl = require('./controllers/chat');
var post_ctl = require('./controllers/post');
var user_ctl = require('./controllers/user');

// sample code
app.get('/api/hello', (req, res) => {
    res.send({
        express: 'Hello From Express'
    });
});
app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});


// user controller
app.post('/login', user_ctl.login);
app.post('/signup', user_ctl.sign_up);
// app.post('/addprofile', user_ctl.add_profile);
// app.get('/getprofile', user_ctl.get_profile);
// app.post('/updateprofile', user_ctl.update_profile);
// app.post('/addfriend', user_ctl.add_friend);
// app.get('/getfriend', user_ctl.get_friend);
// app.delete('deletefriend', user_ctl.delete_friend);
// app.post('/uploadphoto', user_ctl.upload_photo);

// post controller
// app.get('/getpost', post_ctl.get_post);
// app.post('/addpost', post_ctl, add_post);
// app.delete('/deletepost', post_ctl.delete_post);
// app.get('/getcomment', post_ctl.get_comment);
// app.post('/addcomment', post_ctl.add_comment);

// chat controller
app.listen(port, () => console.log(`Listening on port ${port}`));