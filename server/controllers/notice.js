var Notice = require('../models/notice.js');
var User = require('../models/user');
var Relation = require('../models/relation');
var async = require('async');


var getNotice = function(req, res) {
    var userID = req.params.userID;
    var privateNotices = [];
    var publicNotices = [];
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
            Notice.getPublicNotice(ids, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send({
                        error: err,
                        data: null,
                    })
                    return;
                }
                publicNotices = data.Items.map(obj => {
                    return obj.attrs;
                })
                Notice.getPrivateNotice(userID, function(err1, data1) {
                    if (err1) {
                        console.log(err1);
                        res.send({
                            error: err1,
                            data: null,
                        })
                        return;
                    } else {
                        console.log(err1);
                        privateNotices = data1.Items.map(obj => {
                            return obj.attrs
                        });
                        var notices = privateNotices.concat(publicNotices);
                        console.log(notices);
                        addUserToSender(notices, function(results) {
                            //sort by date
                            results.sort(function(a, b) {
                                return a.createdAt < b.createdAt;
                            })
                            res.send({
                                error: null,
                                data: results
                            })
                        })
                    }
                })
            })
        }
    })
}

var deleteNotice = function(req, res) {
    console.log("Notice Controller: delete notice ");
    var notice = req.body;
    Notice.deleteNotice(notice, function(err) {
        console.log(err);
        res.send({
            error: err,
        })
    })
}
var notice_controller = {
    get_notice: getNotice,
    delete_notice: deleteNotice,
    addUserToSender: addUserToSender,
};

module.exports = notice_controller;

async function addUserToSender(requests, callback) {
    var counter = 0;
    async.each(requests, function(request, cb) {
        console.log(request.sender);
        User.getInfo(request.sender, function(err, data) {
            if (err)
                console.log(err);
            if (data.Count > 0)
                requests[counter].sender = data.Items[0].attrs;
            else
                console.log(request.sender, ' is not a user');
            counter++;
            cb();
        })
    }, function() {
        callback(requests);
    });
}