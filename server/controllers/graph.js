var Graph = require('../models/graph');
var User = require('../models/user');
var Relations = require('../models/relation');

var generateGraph = function(req, res) {
    //Graph.generateGraph();
    // put friendship into graph
    Relations.getAll(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({
                error: err
            });
            return;
        }
        var friends = data.Items.map(obj => {
                var tmp = {
                    SID: obj.attrs.userID,
                    EID: obj.attrs.objectID,
                    type: obj.attrs.type
                };
                return tmp;
            }) //console.log(friends);
        User.getAllUser(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send({
                    error: err
                });
                return;
            }
            var users = data.Items.map(obj => {
                    return obj.attrs;
                })
                //console.log(users);
            var toAffilEdges = users.map(obj => {
                    var tmp = {}
                    tmp['SID'] = obj.userID;
                    tmp['EID'] = obj.affiliation;
                    tmp['type'] = 'to_affiliation';
                    return tmp;
                })
                //console.log(users);
            var fromAffilEdges = users.map(obj => {
                    var tmp = {}
                    tmp['EID'] = obj.userID;
                    tmp['SID'] = obj.affiliation;
                    tmp['type'] = 'from_affiliation';
                    return tmp;
                })
                //console.log(fromAffilEdges);
            var affilEdges = toAffilEdges.concat(fromAffilEdges);
            //console.log(affilEdges);

            var interestEdges = [];
            for (i in users) {
                for (j in users[i].interests) {
                    //console.log(users[i].interests[j]);
                    var toInterest = {
                        SID: users[i].userID,
                        EID: users[i].interests[j],
                        type: 'to_interest'
                    };
                    var fromInterest = {
                            SID: users[i].interests[j],
                            EID: users[i].userID,
                            type: 'from_interest',
                        }
                        // console.log(toInterest);
                    interestEdges.push(toInterest);
                    interestEdges.push(fromInterest);
                }
            }
            //console.log(interestEdges);
            var edges = friends.concat(affilEdges, interestEdges);
            //console.log(edges);
            //put interest and affiliation into graph 
            Graph.create(edges, function(err1, data1) {
                if (err1) {
                    console.log(err1);
                    res.send({
                        error: err
                    });
                } else {
                    console.log('Add relations to Graph');
                    res.send({
                        error: null
                    })
                }
            })
        })
    })
}

var graph_controller = {
    generate_graph: generateGraph
}

module.exports = graph_controller;