var User = require('../models/database').User;
var Relation = require('../models/database').Relation;
var Post = require('../models/database').Post;
var Chat = require('../models/chat');

var SHA3 = require("crypto-js/sha3");
const uuidv1 = require('uuid/v1');
var async = require("async");

/* Initialize some Users */
var users = [];
for (var i = 0; i < 7; i++) {
    users[i] = {
        username: 'user_' + i,
        firstname: 'firstname_' + i,
        lastname: 'lastname_' + i,
        fullname: 'firstname_' + i + ' lastname_' + i,
        birthday: '2018120' + i,
        gender: i % 2 == 0 ? 'M' : 'F',
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
    for (var i = 0; i < 7; i++) {
        posts[i] = {
            postID: uuidv1(),
            postBy: IDs[i],
            content: "Post " + i,
            type: 'post',
        }
        posts[i]['ID'] = posts[i]['postID'];
    }
}

var chats = [];

function makeChat() {
    counter = 0;
    for (var i = 0; i < 5; i++)
        for (var j = i + 1; j < 5; j++) {
            chats[counter] = {
                members: [IDs[i], IDs[j]]
            }
            counter++;
        }
}

function makeRelation() {
    var k = 0;
    counter = 0;
    for (var i = 0; i < 5; i++) {
        for (var j = i + 1; j < 5; j++) {
            //console.log(i, (i + j) % 5);
            relations[k] = {
                userID: IDs[i],
                objectID: IDs[j],
                type: 'friend',
                chatID: chats[counter].chatID,
            }
            k++;
            relations[k] = {
                userID: IDs[j],
                objectID: IDs[i],
                type: 'friend',
                chatID: chats[counter].chatID,
            }
            k++;
            counter++
        }
    }
}

var init = function(req, res) {
    User.create(users, function(err, data) {
        console.log('created 7 test users in DynamoDB');
        IDs = data.map(obj => {
            return obj.attrs.userID;
        })
        makeChat();
        //console.log(chats);
        Chat.createChat(chats, function(err1, data1) {
            if (err1)
                console.log(err1);
            chats = data1.map(obj => {
                    return obj.attrs
                })
                //console.log(chats);
            makeRelation();
            //console.log(relations);
            Relation.create(relations, function(err2, data2) {
                if (err2)
                    console.log(err2);
                console.log('created 20 test relations in DynamoDB');
            });
        })

        makePost();
        Post.create(posts, function(err3, data3) {
            if (err3)
                console.log(err3);
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