var dynamo = require('dynamodb');
var Joi = require('joi');
var SHA3 = require("crypto-js/sha3");
dynamo.AWS.config.loadFromPath('config.json');

var User = dynamo.define('User', {
    hashKey: 'username',
    //rangeKey: 'userID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    schema: {
        username: Joi.string(),
        userID: dynamo.types.uuid(),
        password: Joi.string(),
        email: Joi.string().email(),
        firstname: Joi.string(),
        lastname: Joi.string(),
        status: Joi.string(),
        affiliation: Joi.string(),
        birthday: Joi.string(),
        interests: dynamo.types.stringSet(),
        chats: dynamo.types.numberSet(),
    }
});

/* Create the table */
dynamo.createTables({
    'User': {
        readCapacity: 5,
        writeCapacity: 10
    },
}, function(err) {
    if (err) {
        console.log('Error creating tables: ', err);
    } else {
        console.log('Tables has been created');
    }
});

/* sign up */
var userTable_addUser = function(user, ctrl_cb) {
    console.log("userTable: Adding new user " + user.username);
    // check if the account exist
    User.get({
        username: user.username,
    }, function(err, usr) {
        if (usr) //existed
        {
            console.log("This user ", usr.get('username'), "already existed.")
            ctrl_cb("This user name already existed.", null);
        } else {
            // create new user
            var hashedPassword = SHA3(user.password).toString();
            User.create({
                username: user.username,
                password: hashedPassword,
                firstname: user.firstname,
                lastname: user.lastname,
            }, function(err, usr_1) {
                if (err)
                    ctrl_cb(err, null);
                else {
                    console.log('created new user', usr_1.get('username'));
                    ctrl_cb(null, usr_1.attrs);
                }
            });
        }
    });
}


var userTable_login = function(user, ctrl_cb) {
    console.log("userTable: Login for ", user.username);
    User.get({
        username: user.username,
    }, function(err, usr) {
        if (usr) {
            var hashedPassword = SHA3(user.password).toString();
            if (hashedPassword == usr.get('password')) {
                //login now
                ctrl_cb(null, usr.get('username'));
            } else {
                ctrl_cb('Error: incorrect password', null);
            }
        } else {
            ctrl_cb(err.message, null)
        }
    })
}

var userTable_updateProfile = function(user, ctrl_cb) {
    console.log("userTable: updateProfile for ", user.username);
    User.update({
        username: user.username,
        status: user.status,
        affiliation: user.affiliation,
        birthday: user.birthday,
        interests: user.interests,
    }, function(err, usr) {
        if (err)
            ctrl_cb(err.message, null);
        else {
            ctrl_cb(null, usr.attrs);
        }
    })
}

var userTable = {
    addUser: userTable_addUser,
    login: userTable_login,
}

module.exports = userTable;