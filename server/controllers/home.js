var User = require('../models/user');
var passport = require('passport');

var login = function(req, res, next) {
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
            // update login status 
            console.log(user.userID);
            User.updateProfile({
                userID: user.userID,
                status: 1,
            }, function(err1, data1) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                return res.send({
                    data: user,
                    error: null,
                });
            })

        });
    })(req, res, next);
}

var logout = function(req, res) {
    var userID = req.body.userID;
    req.logout();
    User.updateProfile({
            userID: userID,
            status: 0,
        }, function(err, data) {
            if (err)
                console.log(err);
        })
        //res.redirect('/');
    res.send({
        error: 'logout',
        data: null,
    })
}
var signup = function(req, res) {
    console.log("User Controller: sign up");
    var newUser = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        fullname: req.body.firstname + ' ' + req.body.lastname,
        gender: req.body.gender || null,
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

var home_controller = {
    login: login,
    logout: logout,
    signup: signup,
}

module.exports = home_controller;