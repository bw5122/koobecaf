var Chat = require('../models/chat');
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

var chat_controller = {
    create_group_chat: createGroupChat,
    add_member: addMember,
    get_all_group_chat: getAllGroupChat,
};

module.exports = chat_controller;