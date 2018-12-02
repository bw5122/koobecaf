var Comm = require('../models/comment');


var addComment = function(req, res) {
    console.log("Comment Controller: addComment");
    var comment = req.body;
    Comm.addComment(comment, function(err, data) {
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
    var comment = req.body;
    Comm.deleteComment(comment, function(err) {
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