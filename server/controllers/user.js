var User = require('../models/user');
var SHA3 = require("crypto-js/sha3");
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
    var profile = req.body;
    profile['fullname'] = profile.firstname + " " + profile.lastname
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


/* need username, oldpassword, newpassword */
var changePassword = function(req, res) {
    var user = req.body;
    User.findUser(user, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null
            })
            return;
        }
        //console.log(data);
        console.log
        if (SHA3(user.oldpassword).toString() !== data.password) {
            console.log("Incorrect password");
            res.send({
                error: "The old password is incorrect",
                data: null
            })
            return;
        }
        var hashedPassword = SHA3(user.newpassword).toString();
        var newuser = {
            userID: data.userID,
            password: hashedPassword,
        }
        User.updateProfile(newuser, function(err1, data1) {
            if (err1) {
                console.log(err1);
                res.send({
                    error: err1,
                    data: null,
                })
            }
            console.log(data1);
        })
    })

}

var user_controller = {
    sign_up: signUp,
    login: login,
    update_profile: updateProfile,
    get_profile: getProfile,
    change_password: changePassword
};

module.exports = user_controller;