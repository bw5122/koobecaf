var Notice = require('./database').Notice;
var noticeTable_create = function(notice, cb) {
    console.log("Notice Table: create new notice " + notice.type);
    Notice.create(notice, function(err, ntc) {
        if (err)
            cb(err, null);
        else {
            console.log('created new notice', ntc.get('type'));
            cb(null, ntc.attrs);
        }
    });
}

/* */
var noticeTable_delete = function(notice, cb) {
    console.log("Relation Table: delete notice " + notice.noticeID);
    Notice.destroy(notice.noticeID, function(err) {
        console.log(err);
        cb(err);
    })
}

var noticeTable_getPublicNotice = function(IDs, cb) {
    console.log("Notice Table: getPublicNotices " + IDs);
    // var date = new Date();
    // var temp = date.getDate();
    // date.setDate(temp - 7);
    // var current_date = JSON.stringify(date);
    Notice.scan().where('sender').in(IDs).where('type').beginsWith('public').exec(cb);
}

var noticeTable_getPrivateNotice = function(userID, cb) {
    console.log("Notice Table: getPrivateNotices " + userID);
    Notice.query(userID).usingIndex('receiverIndex').descending().filter('type').contains('private').exec(cb);
}

var noticeTable_getFriendRequest = function(userID, cb) {
    console.log("Notice Table: getFriendRequest " + userID);
    Notice.query(userID).usingIndex('receiverIndex').descending().filter('type').equals('friend_request').exec(cb);
}



var noticeTable = {
    addNotice: noticeTable_create,
    deleteNotice: noticeTable_delete,
    getPublicNotice: noticeTable_getPublicNotice,
    getPrivateNotice: noticeTable_getPrivateNotice,
    getFriendRequest: noticeTable_getFriendRequest,
    sendFriendRequest: noticeTable_create,
}

module.exports = noticeTable;