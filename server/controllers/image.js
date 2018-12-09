var bucket = require("../models/image");
var User = require('../models/user');
var Post = require('../models/post');

var singleUploadPhoto = bucket.uploadPhoto.single('photo');
var singleUploadImage = bucket.uploadImage.single('image');

var uploadUserPhoto = function(req, res) {
    console.log("Image Controller: uploadUserPhoto");
    console.log(req.params);
    var userID = req.params.userID;
    singleUploadPhoto(req, res, function(err) {
        if (err) {
            return res.status(422).send({
                err: {
                    title: 'Image Upload Error',
                    detail: err.message
                },
                data: null
            });
        } else {
            //store the image into userTable
            console.log(req.file);
            var usr = {
                userID: userID,
                photo: req.file.location,
            }
            User.updateProfile(usr, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send({
                        data: null,
                        err: err
                    });
                } else {
                    console.log(data);
                    res.send({
                        data: data,
                        err: null
                    });
                }
            });

        }
    });
}

var uploadPostImage = function(req, res) {
    console.log("Image Controller: uploadPostImage");
    console.log(req.params);
    var postID = req.params.postID;
    singleUploadImage(req, res, function(err) {
        if (err) {
            return res.status(422).send({
                err: {
                    title: 'Image Upload Error',
                    detail: err.message
                },
                data: null
            });
        } else {
            //store the image into userTable
            console.log(req.params.postID);
            var pst = {
                postID: postID,
                ID: postID,
                image: req.file.location,
            }
            Post.updateImage(pst, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send({
                        data: null,
                        err: err
                    });
                } else {
                    console.log(data);
                    res.send({
                        data: data,
                        err: null
                    });
                }
            });

        }
    });
}

var image_controller = {
    upload_user_photo: uploadUserPhoto,
    upload_post_image: uploadPostImage,
}

module.exports = image_controller;
