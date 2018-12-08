// var dynamo = require('dynamodb');
// var Joi = require('joi');
// dynamo.AWS.config.loadFromPath('config.json');

// var Post = dynamo.define('Post', {
//     hashKey: 'postID',
//     rangeKey: 'ID',
//     // add the timestamp attributes (updatedAt, createdAt)
//     timestamps: true,
//     updatedAt: false,
//     schema: {
//         postID: Joi.string(),
//         ID: Joi.string(),
//         type: Joi.string(),
//         content: Joi.string(),
//         creator: Joi.string(),
//         postBy: Joi.string(),
//         image: Joi.string(),
//         friendtags: dynamo.types.stringSet(),
//     },
//     indexes: [{
//         hashKey: 'postBy',
//         rangeKey: 'createdAt',
//         name: 'postByIndex',
//         type: 'global',
//     }, {
//         hashKey: 'postID',
//         rangeKey: 'createdAt',
//         name: 'postIDIndex',
//         type: 'global',
//     }]
// });

// dynamo.createTables({
//     'Post': {
//         readCapacity: 5,
//         writeCapacity: 10
//     },
// }, function(err) {
//     if (err) {
//         console.log('Error creating table Post: ', err.message);
//     } else {
//         console.log('Table Post has been created');
//     }
// });
var Post = require('./database').Post;


/* all types of items need postID, ID, postBy */
var postTable_create = function(post, cb) {
    console.log("postTable: Creating new post/comment/likes by " + post.ID);
    Post.create(post, function(err, pst) {
        if (err)
            cb(err, null);
        else {
            console.log('created new post/comment/likes', pst.get('ID'));
            cb(null, pst.attrs);
        }
    });
}

var postTable_getPostInfo = function(postID, cb) {
    console.log("postTable: Getting post information using postBy" + postID);
    Post.query(postID).where('ID').equals(postID).exec(cb);
}

var postTable_getOnePost = function(postID, cb) {
    console.log("postTable: Getting one post using postBy" + postID);
    Post.query(postID).usingIndex('postIDIndex').descending().exec(cb);
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


/* need postID and ID */
var postTable_update = function(post, cb) {
    console.log("postTable: update for ", post.ID);
    Post.update(post, function(err, pst) {
        if (err)
            cb(err.message, null);
        else {
            cb(null, pst);
        }
    })
}

var postTable_delete = function(post, cb) {
    console.log("Post Table: delete ", post.ID);
    Post.destroy(post.postID, post.ID, function(err) {
        console.log(err);
        cb(err);
    })
}

var postTable = {
    createPost: postTable_create,
    getPostInfo: postTable_getPostInfo,
    getOnePost: postTable_getOnePost,
    getOwnPost: postTable_getOwnPost,
    getAllPost: postTable_getAllPost,
    addComment: postTable_create,
    likePost: postTable_create,
    updateImage: postTable_update,
    deleteComment: postTable_delete,
    unlikePost: postTable_delete,
    deletePost: postTable_delete,
    addEvent: postTable_create,
}

module.exports = postTable;