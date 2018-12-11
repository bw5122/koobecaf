var User = require('../models/user');
var Post = require('../models/post');
var searchUser = function(req, res) {
    console.log('search controller: searchUser', req.params.name);
    var name = req.params.name;
    var users = [];
    User.searchByFirstname(name, function(err1, data1) {
        if (err1) {
            console.log(err1);
            res.send({
                error: err1,
                data: null
            });
            return;
        }
        if (data1.Count > 0) {
            users = data1.Items.map(obj => {
                return obj.attrs
            });
        }
        User.searchByLastname(name, function(err2, data2) {
            if (err2) {
                console.log(err2);
                res.send({
                    error: err2,
                    data: null,
                })
                return;
            }
            var tmp = [];
            if (data2.Count > 0)
                tmp = data2.Items.map(obj => {
                    return obj.attrs;
                })
            users = users.concat(tmp.filter(function(item) {
                return users.findIndex(x => x.userID === item.userID);
            }));
            // var users = users.concat(tmp.filter(function(item) {
            //     return users.indexOf(item) < 0;
            // }));
            res.send({
                data: users,
                error: null
            })
        })
    });
}

var searchPost = function(req, res) {
    console.log("Search_controller");
    var event = req.params.name;
    Post.searchEvent(name, function(err, data) {
        if (err) {
            console.log(err)
            res.send({
                error: err,
                data: null,
            })
            return;
        }
        var IDs = []
        if (data.Count > 0)
            IDs = data.Items.map(obj => {
                return obj.attrs;
            })

    })
}

var search_controller = {
    search_user: searchUser,
    search_post: searchPost,
}

module.exports = search_controller;