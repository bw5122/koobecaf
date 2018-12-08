var User = require('../models/database').User;
var Relation = require('../models/database').Relation;
var SHA3 = require("crypto-js/sha3");
var async = require("async");

/* Initialize some Users */
var users = [];
for (var i = 0; i < 5; i++) {
    users[i] = {
        username: 'user_' + i,
        firstname: 'firstname_' + i,
        lastname: 'lastname_' + i,
        birthday: '2018120' + i,
        affiliation: 'Penn',
        interests: ["dota", "lol"],
        password: SHA3('pw_' + i).toString(),
        email: 'user_' + i + '@pennbook.com',
    }
}


/* create some friendships */
var relations = [];
var counter = 0;
var IDs;

function makeRelation() {
    counter = 0;
    for (var i = 0; i < 5; i++) {
        for (var j = 1; j < 5; j++) {
            //console.log(i, (i + j) % 5);
            relations[counter] = {
                userID: IDs[i],
                objectID: IDs[(i + j) % 5],
                type: 'friend',
            }
            counter++;
        }
    }
}

var init = function(req, res) {
    User.create(users, function(err, data) {
        console.log('created 5 test users in DynamoDB');
        IDs = data.map(obj => {
            return obj.attrs.userID;
        })
        makeRelation(IDs);
        //console.log(relations);
        Relation.create(relations, function(err, data) {
            if (err)
                console.log(err);
            console.log('created 20 test relations in DynamoDB');
        });
    });
    res.send({});
}

var wipeout = function(req, res) {
    async.each(IDs, function(user, cb) {
        User.destroy(user, function(err, data) {
            if (err)
                console.log(err);
            cb();
        });
    })
    async.each(relations, function(relation, cb) {
        Relation.destroy(relation.userID, relation.objectID, function(err, data) {
            if (err)
                console.log(err);
            cb();
        });
    })
    res.send({});
}

var test = {
    init: init,
    wipeout: wipeout,
}

module.exports = test;