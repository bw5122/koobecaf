var Post = require('../models/post');
var Comm = require('../models/comment');
var async = require("async");
var createPost = function(req, res) {
    console.log("Post Controller: createPost");
    console.log(req.body);
    Post.createPost(req.body, function(err, data) {
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
    });
};

var getOnePost = function(req, res) {
    console.log("Post Controller: getOnePost");
    var postID = req.params.postID;
    if (!postID)
        res.send({
            data: data,
            error: "Missing parameters in request"
        });
    else {
        Post.getOnePost(postID, function(err, data) {
            var mydata = data;
            if (err) {
                console.log(err);
                res.send({
                    data: null,
                    error: err
                });
            } else if (data.Count == 0) {
                res.send({
                    data: null,
                    error: "Cannot find the post",
                });
            } else {
                //get comments
                var comments = [];
                Comm.getComment(postID, function(err1, data1) {
                    if (err) {
                        console.log(err);
                        res.send({
                            data: null,
                            error: err
                        });
                    } else {
                        if (data1.Items.length > 0)
                            comments = data1.Items;
                        mydata.Items[0].attrs.comments = comments;
                        console.log(mydata.Items[0]);
                        res.send({
                            data: mydata.Items[0],
                            error: null
                        });
                    }
                })

            }
        })
    }
}
var getOwnPost = function(req, res) {
    console.log("Post Controller: getOwnPost");
    var userID = req.params.userID;
    Post.getOwnPost(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                error: err
            });
        } else {
            console.log(data.Items);
            var postIDs = data.Items.map(obj => {
                return obj.attrs.postID
            });
            console.log(postIDs);
            var counter = 0;
            async.forEach(postIDs, function(postID, callback) {
                console.log(postID); // print the key
                Comm.getComment(postID, function(err, data1) {
                    if (err) {
                        callback();
                    } else {
                        var comments = []
                        if (data1.Items.length > 0)
                            comments = data1.Items;
                        data.Items[counter].attrs.comments = comments;
                        console.log(counter);
                        console.log(data.Items[counter].attrs.comments)
                        counter++;
                        // tell async that that particular element of the iterator is done
                        callback();
                    }
                })
            }, function(err) {
                res.send({
                    data: data.Items,
                    error: null
                });
            });
        }
    })
}

var getAllPost = function(req, res) {
    console.log("Post Controller: getAllPost");
    var userID = req.params.userID;
    // find user friends
    // fake id array
    var ids = ["ad8e639c-bbfb-4db9-8fdf-3724a3ee09d5", "249b2d2c-9e07-4566-9818-db05f03eef29"];
    Post.getAllPost(ids, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                error: err
            });
        } else {
            console.log(data.Items);
            var postIDs = data.Items.map(obj => {
                return obj.attrs.postID
            });
            console.log(postIDs);
            var counter = 0;
            async.forEach(postIDs, function(postID, callback) {
                console.log(postID); // print the key
                Comm.getComment(postID, function(err, data1) {
                    if (err) {
                        callback();
                    } else {
                        var comments = []
                        if (data1.Items.length > 0)
                            comments = data1.Items;
                        data.Items[counter].attrs.comments = comments;
                        console.log(counter);
                        console.log(data.Items[counter].attrs.comments)
                        counter++;
                        // tell async that that particular element of the iterator is done
                        callback();
                    }
                })
            }, function(err) {
                res.send({
                    data: data.Items,
                    error: null
                });
            });
        }
    })
}

var post_controller = {
    get_own_post: getOwnPost,
    get_all_post: getAllPost,
    get_one_post: getOnePost,
    create_post: createPost,
};

module.exports = post_controller;