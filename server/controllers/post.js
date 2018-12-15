var Post = require('../models/post');
var User = require('../models/user');
var Notice = require('../models/notice');
var Relation = require('../models/relation');
var async = require("async");
const uuidv1 = require('uuid/v1');

var createPost = function(req, res) {
    console.log("Post Controller: createPost");
    console.log(req.body);
    var post = req.body;
    post['postID'] = uuidv1();
    post['ID'] = post.postID;
    var hashtags = post.hashtags;
    if (hashtags)
        delete post.hashtags;
    //If has hashtgs
    if (hashtags) {
        console.log(hashtags);
        async.each(hashtags, function(event, cb) {
            var event = {
                postID: post.postID,
                ID: 'event_' + uuidv1(),
                postBy: post.postBy,
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
            // send a notice
            var notice;
            if (post.type === 'post')
                notice = {
                    sender: post.postBy,
                    type: 'public_new_status',
                    ref: post.postID,
                }
            else if (post.type === 'share')
                notice = {
                    sender: post.postBy,
                    type: 'public_new_share',
                    ref: post.postID,
                }
            else if (post.type === 'message')
                notice = {
                    receiver: post.postBy,
                    sender: post.creator,
                    type: 'private_new_message',
                    ref: post.postID,
                }
            else {
                console.log('Post type does not belong to post/message/share ');
            }
            Notice.addNotice(notice, function(err, data) {
                if (err)
                    console.log(err);
                else
                    console.log(data.attrs);
            })

        }
    });
};

/* need postID, postBy */
var addComment = function(req, res) {
    console.log("Post Controller: addComment");
    var comment = req.body;
    console.log(comment);
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
                    // send a notice to postBy of type :private_new_comment
                    var notice = {
                        sender: comment.creator,
                        type: 'private_new_comment',
                        receiver: comment.postBy,
                    }
                    Notice.addNotice(notice, function(err, data) {
                        if (err)
                            console.log(err);
                        else
                            console.log(data);
                    })
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
                    // send a private message to postBy
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
                posts2.sort(function(a, b) {
                    return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                })
                posts2 = posts2.map(obj => {
                    if (obj.comments.length > 0)
                        obj.comments.sort(function(c, d) {
                            return new Date(c.createdAt).getTime() > new Date(d.createdAt).getTime()
                        })
                    return obj;
                })
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
    Relation.getFriend(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null,
            })
            return;
        } else {

            var ids = data.Items.map(obj => {
                return obj.attrs.objectID;
            });
            ids.push(userID);
            console.log(ids);
            Post.getAllPost(ids, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send({
                        data: null,
                        error: err
                    });
                } else {
                    //console.log(data.Items);
                    posts1 = constructPosts(data.Items);
                    //console.log(posts1);
                    addUserToPosts(posts1, function(posts2) {
                        posts2.sort(function(a, b) {
                            return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
                        })
                        posts2 = posts2.map(obj => {
                            if (obj.comments.length > 0)
                                obj.comments.sort(function(c, d) {
                                    return new Date(c.createdAt).getTime() > new Date(d.createdAt).getTime()
                                })
                            return obj;
                        })
                        res.send({
                            data: posts2,
                            error: null
                        });
                    })

                }
            })

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

                })
            }, function(err) {
                res.send({
                    error: err
                });
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
    like['ID'] = 'like_' + like.creator;
    delete like.creator;
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
    constructPosts: constructPosts,
    addUserToPosts: addUserToPosts
};

module.exports = post_controller;

/* other functions */
function constructPosts(posts) {
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
                hashtags: [],
            });
            index = acc.length - 1;
        }
        if (obj.attrs.ID.startsWith("comment")) {
            // comments
            delete obj.attrs.postBy;
            //sorted
            acc[index].comments.push(obj.attrs);
        } else if (obj.attrs.ID.startsWith("like")) {
            // likes
            delete obj.attrs.postBy;
            acc[index].likes.push(obj.attrs);
        } else if (obj.attrs.ID.startsWith("event")) {
            //event
            delete obj.attrs.postBy;
            acc[index].hashtags.push(obj.attrs.content);
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
        if (data.Count > 0) {
            console.log(getUserInfo);
            console.log(data.Items[0].attrs);
            return data.Items[0].attrs;
        }
    })
}


async function addUserToPosts(posts, callback) {
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
                    if (data.Count > 0) {
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
                    console.log('comm.creator:', comm.creator);
                    if (users[comm.creator]) {
                        comm['creator'] = users[post.creator];
                    } else {

                        User.getInfo(comm.creator, function(err, data) {
                            if (data.Count > 0) {
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
                            if (data.Count > 0) {
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