const Joi = require('@hapi/joi');

const postValidation = data => (
  Joi.object({
    title: Joi.string()
        .min(3)
        .required(),
    body: Joi.string()
        .min(10)
        .required(),
    created_by: Joi.string().required(),
  })
  .validate(data)
);

const registerValidation = data => (
  Joi.object({
    userName: Joi.string()
            .min(4)
            .max(20)
            .required(),
    firstName: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
    lastName: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
    address: Joi.string(),
    postCode: Joi.number(),
  })
  .validate(data)
);

module.exports.postValidation = postValidation;
module.exports.registerValidation = registerValidation;
