var dynamo = require('dynamodb');
var Joi = require('joi');
dynamo.AWS.config.loadFromPath('config.json');

var Message = dynamo.define('Message', {
    hashKey: 'messageID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        messageID: dynamo.types.uuid(),
        sender: Joi.string(),
        type: Joi.string(),
        chatID: Joi.string(),
        content: Joi.string(),
    },
    indexes: [{
        hashKey: 'chatID',
        rangeKey: 'createdAt',
        name: 'chatIDIndex',
        type: 'global',
    }]
});

/* Create the table */
dynamo.createTables({
    'Message': {
        readCapacity: 5,
        writeCapacity: 10
    },
}, function(err) {
    if (err) {
        console.log('Error creating table Message: ', err.message);
    } else {
        console.log('Table Message has been created');
    }
});


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