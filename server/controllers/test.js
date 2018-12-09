var User = require('../models/database').User;
var Relation = require('../models/database').Relation;
var Post = require('../models/database').Post;
var SHA3 = require("crypto-js/sha3");
const uuidv1 = require('uuid/v1');
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
var posts = [];

function makePost() {
    for (var i = 0; i < 5; i++) {
        posts[i] = {
            postID: uuidv1(),
            postBy: IDs[i],
            content: "Post " + i,
            type: 'post',
        }
        posts[i]['ID'] = posts[i]['postID'];
    }
}

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
        makeRelation();
        //console.log(relations);
        Relation.create(relations, function(err, data) {
            if (err)
                console.log(err);
            console.log('created 20 test relations in DynamoDB');
        });
        makePost();
        Post.create(posts, function(err, data) {
            if (err)
                console.log(err);
            console.log('created 5 posts in DynamoDB');
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