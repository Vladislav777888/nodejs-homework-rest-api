const Joi = require("joi");

exports.createContactDataValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  });

  return schema.validate(data);
};

exports.updateContactDataValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string(),
  });

  return schema.validate(data);
};

exports.updateContactStatusValidator = (data) => {
  const schema = Joi.object({
    favorite: Joi.boolean().required(),
  });

  return schema.validate(data);
};
