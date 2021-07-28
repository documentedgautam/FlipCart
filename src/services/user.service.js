const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
getUserById = async (id) => {
    console.log("In getUserByID with id:", id);
    return new Promise((resolve, reject) => {
        User.findById({_id: id}, (err, res) => {
            if(err){
                throw new ApiError(httpStatus.OK, `No user is found by ID ${id}`);
            }
            else{
                resolve(res);
            }
        });
    });
}

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 * @throws {ApiError}
 */
getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({"email": email}, (err, res) => {
            if(err){
                throw new ApiError(httpStatus.OK, `No user is found by Email ${email}`);
            }
            else{
                resolve(res);
            }
        });
    });
}

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
createUser = async (userBody) => {
    if(User.isEmailTaken(userBody.email)){
        throw new ApiError(httpStatus.OK, "Email already taken");
    }
    return new Promise((resolve, reject) => {
        User.insertOne(userBody, (err, res) => {
            if(err){
                throw new ApiError(httpStatus.OK, "DBERROR: Can not insert the user");
            }
            else{
                resolve(res.ops[0]);
            }
        });
    });
}

module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
  };