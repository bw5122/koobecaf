var dynamo = require('dynamodb');
var Joi = require('joi');
dynamo.AWS.config.loadFromPath('config.json');

var Friend = dynamo.define('Relation', {
    hashKey: 'userID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        userID: Joi.string(),
        objectID: Joi.string(),
        type: Joi.string(),
        weight: Joi.number(),
    },
});

dynamo.createTables({
    'Friend': {
        readCapacity: 5,
        writeCapacity: 10
    },
}, function(err) {
    if (err) {
        console.log('Error creating table Friend: ', err.message);
    } else {
        console.log('Table Friend has been created');
    }
});


var friendTable_getFriend = function(userID, cb) {
    console.log("Friend Table: get friend", userID);
    Friend.query(postID).usingIndex('postIDIndex').descending().exec(cb);
}


var friendTable = {
    getFriend: friendTable_getFriend,
    checkFriendship: friendTable_checkFriendship,
    addFriend: friendTable_addFriend,
    deleteFriend: friendTable_deleteFriend,
}

module.exports = friendTable;