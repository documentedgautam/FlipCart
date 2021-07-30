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
  const id = req.params.userId;
  console.log(user.name, user.email);
  if(err){
    reject(new ApiError(httpStatus.UNAUTHORIZED, err.message));
  }
  else if(!user){
    reject(new ApiError(httpStatus.UNAUTHORIZED, "Please Authenticate"));
  }
  else{
    console.log("verifycalllback1", user._id, user.email, user.password);
    if(!id || !id.match(/^[0-9a-fA-F]{24}$/)){
      console.log(id, "This is Invalid");
      reject(new ApiError(httpStatus.BAD_REQUEST, "Invalid MongoId"));
    }
    if(user._id != req.params.userId){
      reject(new ApiError(httpStatus.FORBIDDEN, "No access"));
    }
    console.log("verifycalllback2", user._id, user.email);
    req.user = user;
    resolve();
  }
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
