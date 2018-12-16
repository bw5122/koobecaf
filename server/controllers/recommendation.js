var Recommendation = require('../models/recommendation');
var fs = require('fs');
var dynamodb_csv = require('dynamodb-csv');
var User = require('../models/user');
var s3 = require('s3');
var config = require('../../../config.json');
var client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: config,
})

var params_download = {
    localFile: "../static/hadoop/output.txt",

    s3Params: {
        Bucket: "koobecaf-friendsrecommendation",
        Key: "hadoop/recSampleOutput.txt",
        // other options supported by getObject
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
    },
};
var create = function(req, res) {
    console.log("recommendation controller: ")

    var downloader = client.downloadFile(params_download);
    downloader.on('error', function(err) {
        console.error("unable to download:", err.stack);
    });
    downloader.on('progress', function() {
        console.log("progress", downloader.progressAmount, downloader.progressTotal);
    });
    downloader.on('end', function() {
        console.log("done downloading");
        fs.readFile('../static/hadoop/output.txt', 'utf8', function(err, contents) {
            //console.log(contents);
            var recomms = []
            var lines = contents.split('\n');
            for (i in lines) {
                var items = lines[i].split('\t');
                var recomm = {
                    userID: items[0],
                    objectID: items[1],
                    weight: parseFloat(items[2]),
                }
                recomms.push(recomm);
            }
            console.log(recomms);
            Recommendation.create(recomms, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send({
                        error: err,
                        data: null,
                    })
                } else {
                    console.log(data);
                    res.send({
                        error: null,
                        data: data,
                    })
                }
            })
        });
    });
}



var getRecommendation = function(req, res) {
    console.log("Recommendation controller: getRecommendation");
    var userID = req.params.userID;
    console.log(userID);
    Recommendation.get(userID, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                error: err,
                data: null,
            })
            return;
        }
        var IDs = data.Items.map(obj => {
            return obj.attrs.userID
        })
        console.log(IDs);
        User.addUserInfo(IDs, function(users) {
            console.log(users)
            res.send({
                data: users,
                error: null,
            })
        })
    })
}

var recommendation_controller = {
    create: create,
    get_recommendation: getRecommendation,
}

module.exports = recommendation_controller;