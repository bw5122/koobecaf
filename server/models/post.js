var dynamo = require('dynamodb');
var Joi = require('joi');
var SHA3 = require("crypto-js/sha3");
dynamo.AWS.config.loadFromPath('config.json');

var Post = dynamo.define('Post', {
    hashKey: 'postID',
    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    updatedAt: false,
    schema: {
        postID: dynamo.types.uuid(),
        content: Joi.string(),
        creator: Joi.string(),
        postBy: Joi.string(),
        image: Joi.string(),
        friendtags: dynamo.types.stringSet(),
        likes: dynamo.types.stringSet(),
    },
    indexes: [{
        hashKey: 'postBy',
        rangeKey: 'createdAt',
        name: 'postByIndex',
        type: 'global',
    }]
});

/* Create the table */
dynamo.createTables({
    'Post': {
        readCapacity: 5,
        writeCapacity: 10
    },
}, function(err) {
    if (err) {
        console.log('Error creating table Post: ', err.message);
    } else {
        console.log('Table Post has been created');
    }
});

var postTable_createPost = function(post, ctrl_cb) {
    console.log("postTable: Creating new post by " + post.postBy);
    Post.create(post, function(err, post1) {
        if (err)
            ctrl_cb(err, null);
        else {
            console.log('created new user', post1.get('postBy'));
            ctrl_cb(null, post1.attrs);
        }
    });
}

var postTable_getOnePost = function(postID, cb) {
    console.log("postTable: Getting one post using postID" + postID);
    Post.query(postID).exec(cb);
}

var postTable_getOwnPost = function(userID, cb) {
    console.log("postTable: Getting own post using postBy" + userID);
    Post.query(userID).usingIndex('postByIndex').descending().exec(cb);
}

var postTable_getAllPost = function(IDs, cb) {
    // show three days data
    var date = new Date();
    var temp = date.getDate();
    date.setDate(temp - 3);
    var current_date = JSON.stringify(date);
    console.log("postTable: Getting all post using postBy" + IDs);
    Post.scan().where('postBy').in(IDs).where('createdAt').gt(current_date).exec(cb);
}

var postTable_updateImage = function(post, cb) {
    console.log("postTable: update image url for ", post.postID);
    Post.update(post, function(err, pst) {
        if (err)
            cb(err.message, null);
        else {
            cb(null, pst);
        }
    })
}
var postTable = {
    createPost: postTable_createPost,
    getOwnPost: postTable_getOwnPost,
    getAllPost: postTable_getAllPost,
    getOnePost: postTable_getOnePost,
    updateImage: postTable_updateImage,
}

module.exports = postTable;