var Comm = require('../models/comment');
const uuidv1 = require('uuid/v1');
var NewPost = require('../models/new_post');
var addComment = function(req, res) {
    console.log("Comment Controller: addComment");
    var comment = req.body;
    comment['ID'] = "comment_" + uuidv1();
    NewPost.addComment(comment, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                error: err
            });
        } else {
            console.log(data);
            res.send({
                data: data,
                error: null
            });
        }
    })
}

var deleteComment = function(req, res) {
    console.log("Comment Controller: deleteComment");
    var commentID = req.body.commentID;
    Comm.deleteComment(commentID, function(err) {
        res.send({
            error: err
        });
    })
}


var comment_controller = {
    add_comment: addComment,
    delete_comment: deleteComment,
};

module.exports = comment_controller;