// var dynamo = require('dynamodb');
// var Joi = require('joi');
// dynamo.AWS.config.loadFromPath('config.json');

// var Relation = dynamo.define('Notice', {
//     hashKey: 'noticeID',
//     // add the timestamp attributes (updatedAt, createdAt)
//     timestamps: true,
//     updatedAt: false,
//     schema: {
//         noticeID: dynamo.types.uuid(),
//         sender: Joi.string(),
//         content: Joi.string(),
//         type: Joi.string(),
//         // link: Joi.string(),
//         // receiver: Joi.string(),
//     },
//     indexes: [{
//         hashKey: 'receiver',
//         rangeKey: 'createdAt',
//         name: 'receiverIndex',
//         type: 'global',
//     }]
// });


// dynamo.createTables({
//     'Relation': {
//         readCapacity: 5,
//         writeCapacity: 10
//     },
// }, function(err) {
//     if (err) {
//         console.log('Error creating table Relation: ', err.message);
//     } else {
//         console.log('Table Relation has been created');
//     }
// });

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
    console.log("Relation Table: delete notice " + notice.type);
    if (notice.type.startsWith('private')) {
        Relation.destroy(notice.noticeID, function(err) {
            console.log(err);
            cb(err);
        })
    }
}

var noticeTable_getPublicNotices = function(IDs, cb) {
    console.log("Notice Table: getPublicNotices " + IDs);
    // var date = new Date();
    // var temp = date.getDate();
    // date.setDate(temp - 7);
    // var current_date = JSON.stringify(date);
    Notice.scan().where('sender').in(IDs).where('type').beginsWith('public').exec(cb);
}

var noticeTable_getPrivateNotices = function(userID, cb) {
    console.log("Notice Table: getPrivateNotices " + userID);
    Notice.query(userID).usingIndex('receiverIndex').descending().exec(cb);
}


var noticeTable = {
    addNotice: noticeTable_create,
    deleteNotice: noticeTable_delete,
    getPublicNotices: noticeTable_getPublicNotices,
    getPrivateNotices: noticeTable_getPrivateNotices,
}

module.exports = noticeTable;