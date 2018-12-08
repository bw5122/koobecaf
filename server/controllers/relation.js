var Relation = require('../models/relation');


var getFriend = function(req, res) {
    var userID = req.params.userID;
    Relation.getFriend(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null
            })
        } else {
            var IDs = data.Items.map(obj => {
                return obj.attrs.objectID;
            })
            console.log(IDs);
        }
    })
}



var relation_controller = {
    get_friend: getFriend,

};

module.exports = relation_controller;