const Joi = require("joi");
const { enums } = require("../constants");

const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

exports.registerValidator = (data) => {
  const schema = Joi.object({
    password: Joi.string().regex(PASSWD_REGEX).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    subscription: Joi.string().valid(
      ...Object.values(enums.USER_SUBSCRIPTION_ENUM)
    ),
  });

  return schema.validate(data);
};

exports.loginValidator = (data) => {
  const schema = Joi.object({
    password: Joi.required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};

exports.updateUserSubscriptionValidator = (data) => {
  const schema = Joi.object({
    subscription: Joi.string()
      .valid(...Object.values(enums.USER_SUBSCRIPTION_ENUM))
      .required(),
  });

  return schema.validate(data);
};

exports.verifyEmailAgainValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(data);
};
