var Chat = require('../models/chat');
var Message = require('../models/message');
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
var getChatHistory = function(chatID, callback) {
    console.log("Chat Controller: get Chat History for " + chatID);
    Message.getMessage(chatID, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            //console.log(data);
            var history = data.Items.map(obj => {
                return obj.attrs
            })
            callback(history);
        }
    })
}

var addMember;
var getAllGroupChat;

var chat_controller = {
    create_group_chat: createGroupChat,
    add_member: addMember,
    add_message: addMessage,
    get_all_group_chat: getAllGroupChat,
    get_chat_history: getChatHistory,
};

module.exports = chat_controller;