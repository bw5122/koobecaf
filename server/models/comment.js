var dynamo = require('dynamodb');
var Joi = require('joi');
dynamo.AWS.config.loadFromPath('config.json');

var Comm = dynamo.define('Comment', {
    hashKey: 'postID',
    rangeKey: 'createdAt',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        postID: Joi.string(),
        content: Joi.string(),
        creator: Joi.string(),
    },
});

/* Create the table */
dynamo.createTables({
    'Comment': {
        readCapacity: 5,
        writeCapacity: 10
    },
}, function(err) {
    if (err) {
        console.log('Error creating table Comment: ', err.message);
    } else {
        console.log('Table Comment has been created');
    }
});

var commentTable_addComment = function(comment, cb) {
    console.log("Comment Table: add Comment");
    Comm.create(comment, function(err, com1) {
        if (err)
            cb(err, null);
        else {
            console.log('created new comment', com1.get('postID'));
            cb(null, com1.attrs);
        }
    });
}

var commentTable_deleteComment = function(comment, cb) {
    console.log("Comment Table: delete Comment");
    Comm.destroy(comment.postID, comment.createdAt,
        function(err) {
            console.log(err);
            cb(err);
        })
}

var commentTable_getComment = function(postID, cb) {
    console.log("Comment Table: get comment");
    Comm.query(postID).descending().exec(cb);
}

var commentTable = {
    addComment: commentTable_addComment,
    deleteComment: commentTable_deleteComment,
    getComment: commentTable_getComment,
}

module.exports = commentTable;