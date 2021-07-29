const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */
const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  console.log(req.params.userId, user._id, (req.params.userId != user._id))
  console.log("verifyyyyyyyy",req.body.email, req.params.userId);
  if(!req.params.userId || (req.params.userId != user._id)){
    reject(new ApiError(httpStatus.FORBIDDEN, "You are not permitted to access this data"));
  }
  if(user){
    // console.log(user);
    req.body = user;
    resolve();
  }
  reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
};

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 * 
 */
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    // TODO: CRIO_TASK_MODULE_AUTH - Authenticate request
    passport.authenticate("jwt",
      { session: false },
      verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
