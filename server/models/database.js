var dynamo = require('dynamodb');
var Joi = require('joi');

//TODO, input your config.json path
dynamo.AWS.config.loadFromPath('config.json');
//dynamo.AWS.config.loadFromPath('config.json');
//  let AWS = require('aws-sdk');
//  AWS.config.update({region:'us-east-1'});



var Chat = dynamo.define('Chat', {
    hashKey: 'chatID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        chatID: dynamo.types.uuid(),
        members: dynamo.types.stringSet(),
        name: Joi.string(),
    },
});

var Notice = dynamo.define('Notice', {
    hashKey: 'noticeID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        noticeID: dynamo.types.uuid(),
        sender: Joi.string(),
        content: Joi.string(),
        type: Joi.string(),
        ref: Joi.string(),
        receiver: Joi.string(),
    },
    indexes: [{
        hashKey: 'receiver',
        rangeKey: 'createdAt',
        name: 'receiverIndex',
        type: 'global',
    }]
});

var Recommendation = dynamo.define('Recommendation', {
    hashKey: 'userID',
    rangeKey: 'objectID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    schema: {
        userID: dynamo.types.uuid(),
        objectID: Joi.string(),
        weight: Joi.number(),
    },
    indexes: [{
        hashKey: 'userID',
        rangeKey: 'weight',
        name: 'userIDIndex',
        type: 'global',
    }]
});

var Post = dynamo.define('Post', {
    hashKey: 'postID',
    rangeKey: 'ID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        postID: Joi.string(),
        ID: Joi.string(),
        type: Joi.string(),
        content: Joi.string(),
        creator: Joi.string(),
        postBy: Joi.string(),
        image: Joi.string(),
        friendtags: dynamo.types.stringSet(),
    },
    indexes: [{
        hashKey: 'postBy',
        rangeKey: 'createdAt',
        name: 'postByIndex',
        type: 'global',
    }, {
        hashKey: 'postID',
        rangeKey: 'createdAt',
        name: 'postIDIndex',
        type: 'global',
    }, {
        hashKey: 'content',
        rangeKey: 'createdAt',
        name: 'contentIndex',
        type: 'global',
    }]
});

var User = dynamo.define('User', {
    hashKey: 'userID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    schema: {
        username: Joi.string(),
        userID: dynamo.types.uuid(),
        password: Joi.string(),
        email: Joi.string().email(),
        firstname: Joi.string(),
        lastname: Joi.string(),
        fullname: Joi.string(),
        affiliation: Joi.string(),
        birthday: Joi.string(),
        status: Joi.number(),
        gender: Joi.string(),
        interests: dynamo.types.stringSet(),
        groupchats: dynamo.types.stringSet(),
    },
    indexes: [{
        hashKey: 'username',
        name: 'usernameIndex',
        type: 'global'
    }]
});

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
        data: Joi.string(),
    },
    indexes: [{
        hashKey: 'chatID',
        rangeKey: 'createdAt',
        name: 'chatIDIndex',
        type: 'global',
    }]
});

var Relation = dynamo.define('Relation', {
    hashKey: 'userID',
    rangeKey: 'objectID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        userID: Joi.string(),
        objectID: Joi.string(),
        type: Joi.string(),
        weight: Joi.number(),
        chatID: Joi.string(),
    },
    indexes: [{
        hashKey: 'type',
        rangeKey: 'userID',
        name: 'typeIndex',
        type: 'global',
    }]
});

var Graph = dynamo.define('Graph', {
    hashKey: 'SID',
    rangeKey: 'EID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    schema: {
        SID: Joi.string(),
        EID: Joi.string(),
        type: Joi.string(),
    },
    tableName: 'graph'
});

/* Create the table */

dynamo.createTables({
    'User': {
        readCapacity: 10,
        writeCapacity: 10,
    },
    'Post': {
        readCapacity: 10,
        writeCapacity: 10,
    },
    'Chat': {
        readCapacity: 10,
        writeCapacity: 10,
    },
    'Message': {
        readCapacity: 10,
        writeCapacity: 10,
    },
    'Relation': {
        readCapacity: 10,
        writeCapacity: 10
    },
    'Notice': {
        readCapacity: 10,
        writeCapacity: 10,
    },
    'Graph': {
        readCapacity: 2,
        writeCapacity: 2,
    },
    "Recommendation": {
        readCapacity: 5,
        writeCapacity: 5,
    }
}, function(err) {
    if (err) {
        console.log('Error creating tables: ', err);
    } else {
        console.log('Tables has been created');
    }
});


var db = {
    User: User,
    Post: Post,
    Relation: Relation,
    Chat: Chat,
    Message: Message,
    Notice: Notice,
    Graph: Graph,
    Recommendation: Recommendation,
}

module.exports = db;