var Message = require('./database').Message;

var messageTable_addMessage = function(message, cb) {
    console.log("Message Table: add Message");
    Message.create(message, function(err, msg) {
        if (err)
            cb(err, null);
        else {
            console.log('created new message', msg.get('messageID'));
            cb(null, msg.attrs);
        }
    });
}

var messageTable_getMessage = function(chatID, cb) {
    console.log("Message Table: get Message");
    Message.query(chatID).usingIndex('chatIDIndex').ascending().exec(cb);
}

var messageTable_deleteMessage = function(messageID, cb) {
    console.log("Message Table: delete Message", messageID);
    Message.destroy(messageID, function(err) {
        console.log(err);
        cb(err);
    })
}

var MessageTable = {
    addMessage: messageTable_addMessage,
    getMessage: messageTable_getMessage,
    deleteMessage: messageTable_deleteMessage,
}

module.exports = MessageTable;
