var dynamo = require('dynamodb');
var Joi = require('joi');
dynamo.AWS.config.loadFromPath('config.json');

var Chat = dynamo.define('Chat', {
    hashKey: 'chatID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        chatID: dynamo.types.uuid(),
        members: dynamo.types.stringSet(),
    },
});

/* Create the table */
dynamo.createTables({
    'Chat': {
        readCapacity: 5,
        writeCapacity: 10
    },
}, function(err) {
    if (err) {
        console.log('Error creating table Chat: ', err.message);
    } else {
        console.log('Table Chat has been created');
    }
});


var chatTable_createChat = function(chat, cb) {
    console.log("Chat Table: create Chat");
    Chat.create(chat, function(err, chat) {
        if (err)
            cb(err, null);
        else {
            console.log('created new chat', chat.get('chatID'));
            cb(null, chat.attrs);
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
    console.log("Chat Table: add member", chatID);
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

var chatTable = {
    createChat: chatTable_createChat,
    deleteChat: chatTable_deleteChat,
    addMember: chatTable_addMember,
    removeMember: chatTable_removeMember,
}

module.exports = chatTable;