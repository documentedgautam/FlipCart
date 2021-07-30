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
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
    type,
  };
  return jwt.sign(payload, secret);
  // const token = jwt.sign({
  //   sub: userId,
  //   exp: expires,
  //   type: type,
  // }, secret);
  // return token;
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
  const exp_sec = config.jwt.accessExpirationMinutes * 60;
  let time = Date.now();
  let timeOfExpiry = Math.floor(time/1000) + exp_sec;
  let token = generateToken(user._id,timeOfExpiry,tokenTypes.ACCESS);
  let dateExpiry = new Date(timeOfExpiry*1000);
  let res = {
    "access" : {
            "token" : token,
            "expires" : dateExpiry
    }
  };
  return res;
};
// const generateAuthTokens = async (user) => {
  
  // const accessTokenExpires =
  //   Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;

  // const accessToken = generateToken(
  //   user._id,
  //   accessTokenExpires,
  //   tokenTypes.ACCESS
  // );

  // return {
  //   access: {
  //     token: accessToken,
  //     expires: new Date(accessTokenExpires * 1000),
  //   },
  // };
  // const expires = Math.floor(Date.now() / 1000) + process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60;
  // const token = generateToken(user._id, expires, tokenTypes.ACCESS);
  // const ret = {
  //   access: {
  //     token: token,
  //     expires: new Date(new Date()+expires*1000),
  //   }
  // };
  // return ret;
// };
// console.log(generateAuthTokens({userId: "6005988f06ea6b360cb75747"}));
module.exports = {
  generateToken,
  generateAuthTokens,
};
