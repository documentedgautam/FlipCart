const Joi = require("joi");
const { objectId, password } = require("./custom.validation");
const {isEmailTaken} = require("../models/user.model");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement request validation for "/v1/users/:userId" endpoint
/**
 * Example url: `/v1/users/:userId`
 * Validate the "userId" url *params* field. "userId" value should be a
 * - string
 * - valid Mongo id -> Use the helper function in src/validations/custom.validation.js
 */
const getUser = {
  params: Joi.object().keys({
    _id: Joi.custom(objectId),
    name: Joi.string().trim().required(),
    email: Joi.string().lowercase().trim().required(),
    password: Joi.string().min(8).custom(password),
    walletMoney: Joi.number().required(),
    address: Joi.string(),
  }),
};

module.exports = {
  getUser,
};
