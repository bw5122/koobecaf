    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    var SHA3 = require("crypto-js/sha3");
    var userTable = require('../models/user');


    passport.serializeUser(function(user, done) {
        console.log('passport serializeUser', user);
        if (user) {
            done(null, user.userID);
        }
    });

    passport.deserializeUser(function(id, done) {
        console.log('passport deserializeUser', id);
        userTable.getInfo(id, function(err, user) {
            done(err, user);
        });
    });


    function initPassport() {
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
        passport.authenticationMiddleware = authenticationMiddleware;

    }

    function authenticationMiddleware() {
        return function(req, res, next) {
            if (req.isAuthenticated()) {
                console.log("isAuthenticated!");
                return next();
            }
            console.log("not Authenticated!");
            res.redirect('/');
        }
    }


    module.exports = initPassport;