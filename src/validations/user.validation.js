const Joi = require("joi");
const { objectId, password } = require("./custom.validation");
const {isEmailTaken} = require("../models/user.model");

/**
 * Example url: `/v1/users/:userId`
 * Validate the "userId" url *params* field. "userId" value should be a
 * - string
 * - valid Mongo id -> Use the helper function in src/validations/custom.validation.js
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    // name: Joi.string().trim().required(),
    // email: Joi.string().lowercase().trim().required(),
    // password: Joi.string().min(8).trim().required().custom(password),
    // walletMoney: Joi.number().required(),
    // address: Joi.string(),
  }),
};

const setAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    address: Joi.string().required().min(20),
  }),
};

module.exports = {
  getUser,
  setAddress,
};
