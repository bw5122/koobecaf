var Post = require('../models/post');
var User = require('../models/user');
var async = require("async");
const uuidv1 = require('uuid/v1');

var createPost = function(req, res) {
    console.log("Post Controller: createPost");
    console.log(req.body);
    var post = req.body;
    post['postID'] = uuidv1();
    post['ID'] = post.postID;
    //If has hashtgs
    if (post.hashtags) {
        async.each(post.hashtags, function(name, cb) {
            var event = {
                postID: post.postID,
                ID: 'event_' + uuidv1(),
                content: event,
                type: post.type
            }
            Post.addEvent(event, function(err, data) {
                cb();
            })
        })
    }
    Post.createPost(post, function(err, data) {
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

/* need postID, postBy */
var addComment = function(req, res) {
    console.log("Post Controller: addComment");
    var comment = req.body;
    Post.getPostInfo(comment.postID, function(err, data) {
        if (data.Items) {
            var post = data.Items[0].attrs;
            console.log(post);
            comment['ID'] = "comment_" + uuidv1();
            comment['postBy'] = post.postBy;
            comment['type'] = post.type;
            Post.addComment(comment, function(err, data) {
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
    })
}

/* need postID, postBy, creator, firstname, lastname, photo */
var likePost = function(req, res) {
    console.log("Post Controller: likePost");
    var like = req.body;
    Post.getPostInfo(like.postID, function(err, data) {
        if (data.Items) {
            var post = data.Items[0].attrs;
            console.log(post);
            like['ID'] = "like_" + like.creator;
            like['postBy'] = post.postBy;
            like['type'] = post.type;
            Post.likePost(like, function(err, data) {
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
    })
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
            posts1 = constructPosts(data.Items);
            //console.log(posts1);
            addUserToPosts(posts1, function(posts2) {
                res.send({
                    data: posts2,
                    error: null
                });
            })

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
            posts1 = constructPosts(data.Items);
            console.log(posts1);
            res.send({
                data: posts1,
                error: null
            });
        }
    })
}


/* need postID */
var deletePost = function(req, res) {
    console.log("Post Controller: deleteComment");
    var postID = req.body.postID;
    Post.getOnePost(postID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                data: null,
                error: err
            });
        } else {
            var IDs = data.Items.map(obj => {
                return obj.attrs['ID'];
            });
            // delete all
            async.forEach(IDs, function(ID, callback) {
                console.log('Delete ', ID);
                var temp = {
                    postID: postID,
                    ID: ID,
                }
                Post.deletePost(temp, function(err) {
                    res.send({
                        error: err
                    });
                })
            }, function(err) {

            })
        }
    })
}

/* need postID, ID */
var deleteComment = function(req, res) {
    console.log("Post Controller: deleteComment");
    Post.deleteComment(req.body, function(err) {
        res.send({
            error: err
        });
    })
}

/* need postID, userID */
var unlikePost = function(req, res) {
    console.log("Post Controller: unlikePost");
    var like = req.body;
    like['ID'] = 'like_' + like.userID;
    delete like.userID;
    Post.unlikePost(like, function(err) {
        res.send({
            error: err
        })
    })
}


var post_controller = {
    get_own_post: getOwnPost,
    get_all_post: getAllPost,
    create_post: createPost,
    delete_post: deletePost,
    add_comment: addComment,
    delete_comment: deleteComment,
    like_post: likePost,
    unlike_post: unlikePost,
};

module.exports = post_controller;

/* other functions */
var constructPosts = function(posts) {
    var format_posts = posts.reduce(function(acc, obj) {
        var key = obj.attrs['postID'];
        let index = acc.findIndex(value => {
            return value.postID && value.postID == key
        });
        if (index == -1) {
            acc.push({
                postID: key,
                postBy: obj.attrs['postBy'],
                comments: [],
                likes: [],
            });
            index = acc.length - 1;
        }
        // console.log(acc);
        // console.log(index);
        if (obj.attrs.ID.startsWith("comment")) {
            // comments
            delete obj.attrs.postBy;
            // delete obj.attrs.postID;
            //obj.attrs['user'] = getUserInfo(obj.attrs.creator);
            acc[index].comments.push(obj.attrs);
        } else if (obj.attrs.ID.startsWith("like")) {
            // likes     
            delete obj.attrs.postBy;
            // delete obj.attrs.postID;
            acc[index].likes.push(obj.attrs);
        } else {
            //post
            // console.log(obj.attrs);
            // console.log(index);
            if (obj.attrs.creator) acc[index]['creator'] = obj.attrs.creator;
            acc[index]['createdAt'] = obj.attrs.createdAt;
            if (obj.attrs.image) acc[index]['image'] = obj.attrs.image;
            if (obj.attrs.content) acc[index]['content'] = obj.attrs.content;
            acc[index]['type'] = obj.attrs.type;
        }
        return acc;
    }, []);
    return format_posts;
}


var getUserInfo = async function(userID) {
    User.getInfo(userID, function(err, data) {
        if (data.Items) {
            console.log(getUserInfo);
            console.log(data.Items[0].attrs);
            return data.Items[0].attrs;
        }
    })
}


var addUserToPosts = async function(posts, callback) {
    var users = {};
    async.each(posts, function(post, cb) {
        var dummy = [forPost, forComments, forLikes];
        var counter = 0;
        async.each(dummy, function(item, item_cb) {
            item(item_cb);
        }, cb);
        //add name to postBy
        async function forPost(forPost_cb) {
            if (users[post.postBy]) {
                post['postBy'] = users[post.postBy];
                forPost_cb();
            } else {
                User.getInfo(post.postBy, function(err, data) {
                    if (data.Items[0]) {
                        users[data.Items[0].attrs.userID] = data.Items[0].attrs;
                        post['postBy'] = data.Items[0].attrs;
                        forPost_cb();
                    }
                })
            }
        }
        //add name to all comments
        async function forComments(forComment_cb) {
            if (post.comments.length > 0) {
                //var counter = 0;
                async.each(post.comments, function(comm, comm_cb) {
                    if (users[comm.creator]) {
                        comm['creator'] = users[post.creator];
                    } else {

                        User.getInfo(comm.creator, function(err, data) {
                            if (data.Items[0]) {
                                users[data.Items[0].attrs.userID] = data.Items[0].attrs;
                                comm['creator'] = data.Items[0].attrs;
                            }
                            comm_cb();
                        })
                    }
                }, forComment_cb)
            } else forComment_cb();
        }
        async function forLikes(forLike_cb) {
            if (post.likes.length > 0) {
                //var counter = 0;
                async.each(post.likes, function(like, like_cb) {
                    if (users[like.creator]) {
                        like['creator'] = users[like.creator];
                    } else {
                        User.getInfo(like.creator, function(err, data) {
                            if (data.Items[0]) {
                                users[data.Items[0].attrs.userID] = data.Items[0].attrs;
                                like['creator'] = data.Items[0].attrs;
                            }
                            like_cb();
                        })
                    }
                }, forLike_cb)
            } else forLike_cb();
        }
        //add userInfo to like

    }, function() {
        console.log("Calling callback");
        console.log(users)
        callback(posts);
    })
}