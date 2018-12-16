var fs = require('fs');
var dynamodb_csv = require('dynamodb-csv');

var s3 = require('s3');
var config = require('../../config.json')
var client = s3.createClient({
    maxAsyncS3: 20,
    s3RetryCount: 3,
    s3RetryDelay: 1000,
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: config,
})


var params1 = {
    localFile: "./static/hadoop/output.txt",

    s3Params: {
        Bucket: "koobecaf-friendsrecommendation",
        Key: "hadoop/output.txt",
        // other options supported by getObject
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
    },
};
var downloader = client.downloadFile(params1);
downloader.on('error', function(err) {
    console.error("unable to download:", err.stack);
});
downloader.on('progress', function() {
    console.log("progress", downloader.progressAmount, downloader.progressTotal);
});
downloader.on('end', function() {
    console.log("done downloading");
    fs.readFile('./static/hadoop/output.txt', 'utf8', function(err, contents) {
        //console.log(contents);
        var lines = contents.split('\n');
        for (i in lines) {
            var items = lines[i].split('\t');
            console.log(items);
            var userID = items[0];
            var IDs = items.splice(0, 1);
            for (j in IDs) {
                var recomm = {
                    userID: userID,
                    objectID: IDs[j]
                }
                console.log(recomm);
            }

        }
        console.log(lines);
    });
});



console.log('after calling readFile');