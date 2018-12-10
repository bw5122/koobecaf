var SHA3 = require("crypto-js/sha3");
var async = require("async");
var User = require('./database').User;

/* sign up */
var userTable_addUser = function(user, cb) {
    console.log("userTable: Adding new user: " + user.username);
    //check if the account exist
    User.query(user.username).usingIndex('usernameIndex').exec(function(err, data) {
        if (err)
            cb(err, null);
        else if (data.Count > 0)
            cb("This user name already existed.", null);
        else {
            //create a new user
            var hashedPassword = SHA3(user.password).toString();
            user.password = hashedPassword;
            User.create(user, function(err, usr_1) {
                if (err)
                    cb(err, null);
                else {
                    console.log('created new user', usr_1.get('username'));
                    cb(null, usr_1.attrs);
                }
            });
        }
    })
}

var userTable_login = function(user, cb) {
    console.log("userTable: Login for ", user.username);
    //check if the account exist
    User.query(user.username).usingIndex('usernameIndex').exec(function(err, data) {
        if (err)
            cb(err, null);
        else if (data.Count == 0)
            cb("This user does not exist.", null);
        else {
            usr = data.Items[0].attrs;
            var hashedPassword = SHA3(user.password).toString();
            if (hashedPassword == usr.password) {
                //login now
                cb(null, {
                    userID: usr.userID,
                    firstname: usr.firstname,
                    lastname: usr.lastname,
                });
            } else {
                cb('Error: incorrect password', null);
            }
        }
    })
}

var userTable_findUser = function(user, cb) {
    console.log("userTable: findUser for ", user.username);
    User.query(user.username).usingIndex('usernameIndex').exec(function(err, data) {
        if (err)
            cb(err, null);
        else if (data.Count == 0)
            cb(null, null);
        else {
            cb(null, data.Items[0].attrs);
        };
    })
}
var userTable_updateProfile = function(user, cb) {
    console.log("userTable: updateProfile for ", user.userID);
    User.update(user, function(err, usr) {
        if (err)
            cb(err.message, null);
        else {
            var userinfo = usr.attrs;
            delete userinfo.username;
            delete userinfo.userID;
            delete userinfo.password;
            delete userinfo.updatedAt;
            delete userinfo.createdAt;
            cb(null, userinfo);
        }
    })
}

var userTable_getProfile = function(user, cb) {
    console.log("userTable: updateProfile for ", user.userID);
    User.query(user.userID)
        .attributes(['firstname', 'lastname', 'status', 'affiliation', 'birthday', 'interests', 'email', 'photo'])
        .exec(function(err, data) {
            if (err)
                cb(err, null);
            else if (data.Count == 0)
                cb("This user does not exist.", null);
            else {
                usr = data.Items[0].attrs;
                cb(null, usr);
            }
        })
}

var userTable_getInfo = function(userID, cb) {
    console.log("userTable: get user info for ", userID);
    User.query(userID).attributes(['userID', 'firstname', 'lastname', 'photo']).exec(cb);
}

var userTable_getAllUser = function(cb) {
    console.log("userTable: get all users");
    User.scan().loadAll().attributes(['userID', 'interests', 'affiliation']).exec(cb);
}
var userTable = {
    addUser: userTable_addUser,
    login: userTable_login,
    findUser: userTable_findUser,
    updateProfile: userTable_updateProfile,
    getProfile: userTable_getProfile,
    getInfo: userTable_getInfo,
    addUserInfo: addUserInfo,
    getAllUser: userTable_getAllUser,
}

module.exports = userTable;



/* functional */
function addUserInfo(items, callback) {
    var users = [];
    var counter = 0;
    async.each(items, function(item, cb) {
        userTable_getInfo(item, function(err, data) {
            users[counter] = data.Items[0].attrs;
            counter++;
            cb();
        })
    }, function() {
        callback(users);
    });
}