var Graph = require('./database').Graph;
//var copy = require('copy-dynamodb-table').copy;
let AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

//var config = require('../../../config.json');
/*
var graphTable_generateGraph = function() {
    console.log("graph table: generateGraph");
    copy({
            config: config, // config for AWS
            source: {
                tableName: 'relations', // required
            },
            destination: {
                tableName: 'graph', // required
            },
            log: true, // default false
            create: true // create destination table if not exist
        },
        function(err, result) {
            if (err) {
                console.log(err)
            }
            console.log(result)
        })
}
*/
var graphTable_deleteTable = function() {
    Graph.deleteTable(function(err) {
        if (err) {
            console.log('Error deleting table: ', err);
        } else {
            console.log('Table has been deleted');
        }
    });
};

var graphTable_create = function(edges, cb) {
    console.log("Graph Table: create new edges ");
    console.log(edges);
    Graph.create(edges, function(err, relations) {
        if (err)
            cb(err, null);
        else {
            console.log('created new edge');
            cb(null, relations);
        }
    });
}

var graphTable = {
    deleteTable: graphTable_deleteTable,
    create: graphTable_create,
}

module.exports = graphTable;
