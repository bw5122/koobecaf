var Chat = require('./database').Chat;

var chatTable_createChat = function(chat, cb) {
    console.log("Chat Table: create Chat");
    Chat.create(chat, function(err, chat1) {
        if (err)
            cb(err, null);
        else {
            //console.log('created new chat', chat1.get('chatID'));
            if (!chat1.attrs)
                cb(null, chat1);
            else
                cb(null, chat1.attrs);
        }
    });
}

var chatTable_deleteChat = function(chatID, cb) {
    console.log("Chat Table: delete Chat", chatID);
    Comm.destroy(chatID, function(err) {
        console.log(err);
        cb(err);
    })
}

var chatTable_addMember = function(chat, cb) {
    console.log("Chat Table: add member", chat.chatID);
    Chat.update({
        chatID: chat.chatID,
        members: {
            $add: chat.members
        }
    }, function(err, chat1) {
        console.log("Add ", chat.members, " To chat ", chat1.get('chatID'));
        cb(null, chat1.get('chatID'));
    })
}

var chatTable_deleteMember = function(chat, cb) {
    console.log("Chat Table: delete member", chatID);
    Chat.update({
        chatID: chat.chatID,
        members: {
            $del: chat.members
        }
    }, function(err, chat1) {
        console.log("Delete ", chat.members, " From chat ", chat1.get('chatID'));
        cb(null, chat1.get('chatID'));
    })
}

var chatTable_getInfo = function(chatID, cb) {
    console.log("Chat Table:  get info ", chatID);
    Chat.query(chatID).exec(cb);
}

var chatTable_getAllChat = function(userID, cb) {
    console.log("Chat Table: get all chat", userID);
    Chat.scan().where('members').contains(userID).loadAll().exec(cb);
}

var chatTable = {
    getInfo: chatTable_getInfo,
    createChat: chatTable_createChat,
    deleteChat: chatTable_deleteChat,
    addMember: chatTable_addMember,
    removeMember: chatTable_deleteMember,
    getAllChat: chatTable_getAllChat,
}

module.exports = chatTable;