const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const token = jwt.sign({
    "sub": userId,
    "exp": expires,
    "type": type,
  }, secret);
  return token;
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  const expires = Math.floor(Date.now() / 1000) + process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60;
  const token = generateToken(user._id, expires, tokenTypes.ACCESS);
  // console.log("In generateAuthTokens", user.userId, token);
  const ret = {
    "access": {
      "token": token,
      "expires": new Date(new Date()+expires*1000),
    }
  };
  return ret;
};
// console.log(generateAuthTokens({userId: "6005988f06ea6b360cb75747"}));
module.exports = {
  generateToken,
  generateAuthTokens,
};
