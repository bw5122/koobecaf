var User = require('../models/user');

/* sign up */
var signUp = function(req, res) {
    console.log("User Controller: sign up");
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };
    User.addUser(newUser, function(err, data) {
        if (err) {
            console.log('Error: ', err);
        } else {
            console.log('Success!');
            console.log(data);
        }
    });
}

var login = function(req, res) {
    console.log("User Controller: login");
    var user = {
        username: req.body.username,
        password: req.body.password,
    };
    User.login(user, function(err, data) {
        if (err)
            console.log("Error: ", err);
        else {
            console.log('Success!');
            console.log(data);
        }
    });
};

var user_controller = {
    sign_up: signUp,
    login: login,
};

module.exports = user_controller;