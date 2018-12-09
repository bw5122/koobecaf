var Joi = require('joi');


const createPost_schema = Joi.object().keys({
    postBy: Joi.string().required(),
    type: Joi.string().valid(['post', 'message', 'share']).required(),
    content: Joi.string().required(),
    friendtags: Joi.array(),
})


function checkInput(data, myschema) {
    Joi.validate(data, schema, function(err, value) {
        console.log(err);
        return err;
    });
}

var schema = {
    createPost_schema: createPost_schema,
    checkInput: checkInput,
}

module.exports = schema