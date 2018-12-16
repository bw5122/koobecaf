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
    localFile: "./static/csv/output.csv",

    s3Params: {
        Bucket: "koobecaf-friendsrecommendation",
        Key: "csv/output.csv",
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
    fs.readFile('./static/csv/output.csv', 'utf8', function(err, contents) {
        console.log(contents);
        dynamodb_csv.convertCsvToDynamodb(contents, function(err, result) {
            if (err) {
                console.log(err);
                console.log(err);
            } else {
                console.log(result); //result will be in csv format
                fs.writeFile('./static/dynamo/output', result, function(err, data) {
                    if (err) console.log(err);
                    console.log("Successfully Written to File.");
                    var params = {
                        localFile: "./static/dynamo/output",

                        s3Params: {
                            Bucket: "koobecaf-friendsrecommendation",
                            Key: "dynamo/output",
                            // other options supported by putObject, except Body and ContentLength.
                            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
                        },
                    };
                    var uploader = client.uploadFile(params);
                    uploader.on('error', function(err) {
                        console.error("unable to upload:", err.stack);
                    });
                    uploader.on('progress', function() {
                        console.log("progress", uploader.progressMd5Amount,
                            uploader.progressAmount, uploader.progressTotal);
                    });
                    uploader.on('end', function() {
                        console.log("done uploading");
                    });

                });
            }
        });

    });
});



console.log('after calling readFile');