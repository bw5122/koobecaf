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
            console.log(err);
            res.send({
                data: null,
                error: err
            });
        } else {
            console.log(data);
            res.send({
                data: data,
                error: null
            });
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
        if (err) {
            console.log(err);
            res.send({
                data: null,
                err: err
            });
        } else {
            console.log(data);
            res.send({
                data: data,
                err: null
            });
        }
    });
};

var updateProfile = function(req, res) {
    console.log("User Controller: update_profile");
    // need to check input here
    if (!req.body.userID)
        res.send({
            data: null,
            err: "Missing parameters in request",
        });
    User.updateProfile(req.body, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                err: err
            });
        } else {
            console.log(data);
            res.send({
                data: data,
                err: null
            });
        }
    });
};

var getProfile = function(req, res) {
    console.log("User Controller get_profile");
    // need to check input here
    if (!req.params.userID)
        res.send({
            data: null,
            err: "Missing parameters in request"
        });
    User.getProfile(req.params, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                err: err
            });
        } else {
            console.log(data);
            res.send({
                data: data,
                err: null
            });
        }
    })
}

var user_controller = {
    sign_up: signUp,
    login: login,
    update_profile: updateProfile,
    get_profile: getProfile,
};

module.exports = user_controller;