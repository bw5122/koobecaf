var Relation = require('../models/relation');
var User = require('../models/user');
var Notice = require('../models/notice');
var Chat = require('../models/chat');
var notice_ctrl = require('./notice');
var async = require('async');
var getFriend = function(req, res) {
    var userID = req.params.userID;
    Relation.getFriend(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null
            })
        } else {
            var IDs = data.Items.map(obj => {
                return obj.attrs.objectID;
            })
            console.log(IDs);
            User.addUserInfo(IDs, function(users) {
                users.map(obj => {
                    var index = data.Items.findIndex(item => item.attrs.userID === obj.userID);
                    if (index >= 0)
                        obj['chatID'] = data.Items[index].attrs.chatID;
                    return obj;
                })
                res.send({
                    data: users,
                    error: null,
                })
            })
        }
    })
}

var sendFriendRequest = function(req, res) {
    console.log("Notice Controller: sendFriendRequest ");
    var request = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        type: 'friend_request',
    }
    Notice.sendFriendRequest(request, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null
            })
        } else {
            console.log(data);
            res.send({
                error: null,
                data: data,
            })
        }
    })
}

var getFriendRequest = function(req, res) {
    console.log("Notice Controller: getFriendRequest ");
    var userID = req.params.userID;
    Notice.getFriendRequest(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null,
            })
        } else {
            var requests = data.Items.map(obj => {
                return obj.attrs;
            })
            console.log(requests);
            notice_ctrl.addUserToSender(requests, function(result) {
                res.send({
                    error: null,
                    data: result,
                })
            })

        }
    })
}

var acceptFriend = function(req, res) {
    console.log("Relaiton Controller: acceptFriend");
    var request = req.body;
    var chatID;
    //just for testing 
    var request = {
            receiver: req.body.receiver,
            sender: {
                userID: req.body.sender,
            },
            noticeID: req.body.noticeID,
        }
        // create two edges in relation graph
    console.log(request);

    var steps = [createChat, deleteRequest, sendSucces1, sendSucces2];
    async.each(steps, function(step, cb) {
        step(cb);
    });

    async function createChat(cb) {
        var chat = {
            members: [request.sender.userID, request.receiver],
        }
        Chat.createChat(chat, function(err, data) {
            if (err) {
                console.log(err);
                res.send({
                    error: err,
                    data: null,
                })
                return;
            }
            chatID = data.chatID;
            console.log(chatID);
            addRelation(cb);
        })

    }
    async function addRelation(cb) {
        var edge1 = {
            userID: request.sender.userID,
            objectID: request.receiver,
            type: 'friend',
            chatID: chatID,
        }
        var edge2 = {
            objectID: request.sender.userID,
            userID: request.receiver,
            type: 'friend',
            chatID: chatID,
        }
        Relation.addFriend([edge1, edge2], function(err, data) {
            if (err) {
                console.log(err);
                res.send({
                    error: err,
                    data: null,
                })
                cb();
            } else {
                console.log(data);
                res.send({
                    error: null,
                    data: data,
                })
                cb();
            }
        })
    }

    // destory the friend request 
    async function deleteRequest(cb) {
        Notice.deleteNotice(request, function(err) {
            console.log(err);
            cb();
        })
    }
    async function sendSucces1(cb) {
        // send two notices to each others 
        var notice1 = {
            sender: request.sender.userID,
            receiver: request.receiver,
            type: 'private_new_friend',
        }
        Notice.addNotice(notice1, function(err, data) {
            if (err)
                console.log(err);
            else
                console.log(data);
            cb();
        })
    }
    async function sendSucces2(cb) {
        var notice2 = {
            receiver: request.sender.userID,
            sender: request.receiver,
            type: 'private_new_friend',
        }
        Notice.addNotice(notice2, function(err, data) {
            if (err)
                console.log(err);
            else
                console.log(data);
            cb();
        })
    }

}

var denyFriend = function(req, res) {
    console.log("Relaiton Controller: denyFriend");
    var request = req.body;
    var steps = [deleteRequest, sendDeny];
    async.each(steps, function(step, cb) {
            step(cb);
        }, function(err) {
            res.send({
                error: err
            });
        })
        // destory the friend request 
    async function deleteRequest(cb) {
        Notice.deleteNotice(request, function(err) {
            console.log(err);
            cb();
        })
    }
    async function sendDeny(cb) {
        // send two notices to each others 
        var notice1 = {
            receiver: request.sender.userID,
            sender: request.receiver,
            type: 'private_deny_friend',
        }
        Notice.addNotice(notice1, function(err, data) {
            if (err)
                console.log(err);
            else
                console.log(data);
            cb();
        })
    }

}

var relation_controller = {
    get_friend: getFriend,
    send_friend_request: sendFriendRequest,
    get_friend_request: getFriendRequest,
    add_friend: acceptFriend,
    deny_friend: denyFriend,

};

module.exports = relation_controller;