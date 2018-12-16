// Load the SDK for JavaScript
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
aws.config.loadFromPath('../../config.json');
// aws.config.update({region:'us-east-1'});

// Create the parameters for calling createBucket
var photoBucket = "koobecaf-user-photo";
var imageBucket = "koobecaf-post-image";

var photoBucketParamsPhoto = {
    Bucket: photoBucket
};

var imageBucketParamsPhoto = {
    Bucket: imageBucket
};

// Create S3 service object
s3 = new aws.S3();

s3.createBucket(photoBucketParamsPhoto, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Create", photoBucketParamsPhoto.Bucket, "Success", data.Location);
    }
});

s3.createBucket(imageBucketParamsPhoto, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Create", imageBucketParamsPhoto.Bucket, "Success", data.Location);
    }
});


const fileFilter = (req, file, cb) => {
    console.log(file);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
}

var userBucket_uploadPhoto = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: photoBucket,
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, req.params.userID)
        }
    })
});

var postBucket_uploadImage = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: imageBucket,
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {
                fileField: "Sample User Name"
            });
        },
        key: function(req, file, cb) {
            cb(null, req.params.postID)
        }
    })
});

var mybucket = {
    uploadPhoto: userBucket_uploadPhoto,
    uploadImage: postBucket_uploadImage,
};

module.exports = mybucket;
