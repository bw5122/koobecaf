var Chat = require('../models/chat');
var Message = require('../models/message');
var User = require('../models/user');
var async = require("async");

var createGroupChat = function(req, res) {
    console.log("Chat Controller: createGroupChat");
    var chat = req.body;
    Chat.createChat(chat, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                error: err
            });
        } else {
            console.log(data);
            var chatID = data.chatID;
            res.send({
                data: data,
                error: null
            });
        }
    })
}

var addMessage = function(message, callback) {
    console.log("Chat Controller: add message for " + message.chatID);
    Message.addMessage(message, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            callback(data);
        }
    })
}

/* for server use */
var getChatHistory = function(chatID, callback) {
    console.log("Chat Controller: get Chat History for " + chatID);
    Chat.getInfo(chatID, function(err, data) {
        if (data.Items) {
            var members = data.Items[0].attrs.members;
            var members_obj = {};
            async.each(members, function(member, cb) {
                User.getInfo(member, function(err1, data1) {
                    if (data1.Count > 0) {
                        if (!members_obj[data1.Items[0].attrs.userID])
                            members_obj[data1.Items[0].attrs.userID] = data1.Items[0].attrs;
                    }
                    cb();
                })
            }, function() {
                Message.getMessage(chatID, function(err2, data2) {
                    if (err2) {
                        console.log(err2);
                    } else {
                        //console.log(data);
                        var history = data2.Items.map(obj => {
                            return obj.attrs
                        })
                        var chatinfo = {
                            chatID: chatID,
                            members: members_obj,
                            history: history,
                        }
                        callback(chatinfo);
                    }
                })
            })
        }
    })
}

var addMember = function(req, res) {
    var chat = req.body;
    console.log("Chat Controller: add member to chat " + chat.chatID);
    Chat.addMember(chat, function(err, data) {
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
    })
};


/* for http request */
var getHistory = function(req, res) {
    var chatID = req.params.chatID;
    console.log("Chat Controller: get Chat History for " + chatID);
    Chat.getInfo(chatID, function(err, data) {
        var members = [];
        if (data.Count > 0)
            members = data.Items[0].attrs.members;
        var members_obj = {};

        async.each(members, function(member, cb) {
            User.getInfo(member, function(err1, data1) {

                if (data1.Count > 0) {
                    members_obj[data1.Items[0].attrs.userID] = data1.Items[0].attrs;
                }
                cb();
            })
        }, function() {
            Message.getMessage(chatID, function(err2, data2) {
                if (err2) {
                    console.log(err2);
                } else {
                    //console.log(data);
                    var history = data2.Items.map(obj => {
                        return obj.attrs
                    })
                    var chatinfo = {
                        chatID: chatID,
                        members: members_obj,
                        history: history,
                    }
                    res.send({
                        error: null,
                        data: chatinfo
                    })
                }
            })
        })
    })
}

var getAllGroupChat = function(req, res) {
    console.log("Chat controller: create Group Chat");
    var userID = req.params.userID;
    Chat.getAllChat(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null
            })
        } else {
            var chats = [];
            if (data.Count > 0) {
                chats = data.Items.reduce(function(c, n) {
                    if (n.attrs.members.length > 2)
                        c.push(n.attrs);
                    return c;
                }, [])

            }
            res.send({
                error: err,
                data: chats,
            })
        }
    })
};

var deleteMember = function(req, res) {
    console.log("chat_controller delete Member");
    var chat = req.body;
    Chat.removeMember(chat, function(err, data) {
        res.send({
            error: err,
        })
    })
}

var chat_controller = {
    create_group_chat: createGroupChat,
    add_member: addMember,
    delete_member: deleteMember,
    add_message: addMessage,
    get_all_group_chat: getAllGroupChat,
    get_history: getHistory,
    get_chat_history: getChatHistory,
};

module.exports = chat_controller;