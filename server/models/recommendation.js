var Recommendation = require('./database').Recommendation;


var recommendationTable_create = function(edges, cb) {
    console.log("Recommendation table: create");
    Recommendation.create(edges, function(err, items) {
        if (err)
            cb(err, null);
        else {
            console.log('created new edge');
            cb(null, items);
        }
    });
}

var recommendationTable_get = function(userID, cb) {
    console.log("Recommendation table: get", userID);
    Recommendation.query(userID).usingIndex('userIDIndex').descending().exec(cb);
}


var recommendationTable = {
    create: recommendationTable_create,
    get: recommendationTable_get,
}

module.exports = recommendationTable;