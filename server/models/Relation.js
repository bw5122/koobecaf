var Relation = require('./database').Relation;

var relationTable_getFriend = function(userID, cb) {
    console.log("Friend Table: get friend", userID);
    Relation.query('friend').usingIndex('typeIndex').where('userID').equals(userID).exec(cb);
}

/* need to provide type */
var relationTable_create = function(relation, cb) {
    console.log("Relation Table: create new relation " + relation.type);
    Relation.create(relation, function(err, rel) {
        if (err)
            cb(err, null);
        else {
            console.log('created new relation', rel.get('type'));
            cb(null, rel.attrs);
        }
    });
}

var relationTable_delete = function(relation, cb) {
    console.log("Relation Table: delete relation " + relation.type);
    Relation.destroy(relation, function(err) {
        console.log(err);
        cb(err);
    })
}

var relationTable_checkRelation = function(relation, cb) {
    console.log("Relation Table: check relation " + relation.type);
    Relation.query(relation.userID).where('objectID').equals(relation.objectID).exec(cb);
}

var relationTable = {
    getFriend: relationTable_getFriend,
    checkFriendship: relationTable_checkRelation,
    addFriend: relationTable_create,
    deleteFriend: relationTable_delete,
}

module.exports = relationTable;