var Notice = require('../models/notice.js');
var User = require('../models/user');
var async = require('async');




var notice_controller = {
    addUserToSender: addUserToSender,
};

module.exports = notice_controller;

async function addUserToSender(requests, callback) {
    var counter = 0;
    async.each(requests, function(request, cb) {
        User.getInfo(request.receiver, function(err, data) {
            requests[counter].receiver = data.Items[0].attrs;
            counter++;
            cb();
        })
    }, function() {
        callback(requests);
    });
}