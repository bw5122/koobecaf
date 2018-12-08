// var dynamo = require('dynamodb');
// var Joi = require('joi');
var SHA3 = require("crypto-js/sha3");
// dynamo.AWS.config.loadFromPath('config.json');

// var User = dynamo.define('User', {
//     hashKey: 'userID',
//     // add the timestamp attributes (updatedAt, createdAt)
//     timestamps: true,

//     schema: {
//         username: Joi.string(),
//         userID: dynamo.types.uuid(),
//         password: Joi.string(),
//         email: Joi.string().email(),
//         firstname: Joi.string(),
//         lastname: Joi.string(),
//         affiliation: Joi.string(),
//         birthday: Joi.string(),
//         interests: dynamo.types.stringSet(),
//         groupchats: dynamo.types.stringSet(),
//     },
//     indexes: [{
//         hashKey: 'username',
//         name: 'usernameIndex',
//         type: 'global'
//     }]
// });

// /* Create the table */
// dynamo.createTables({
//     'User': {
//         readCapacity: 5,
//         writeCapacity: 10
//     },
// }, function(err) {
//     if (err) {
//         console.log('Error creating table User: ', err.message);
//     } else {
//         console.log('Table User has been created');
//     }
// });
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

var userTable = {
    addUser: userTable_addUser,
    login: userTable_login,
    updateProfile: userTable_updateProfile,
    getProfile: userTable_getProfile,
    getInfo: userTable_getInfo,
}

module.exports = userTable;