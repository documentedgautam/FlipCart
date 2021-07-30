const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 8 || !value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number and length must be greater than 7"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: config.default_wallet_money,
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

userSchema.pre("save", function(next) {
  var user = this;

  if (!user.isModified('password')){
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err){
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err){
          return next(err);
        }
        user.password = hash;
        next();
    });
  });
});

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email){
  const isTaken = await this.findOne({"email": email});
  // console.log(isTaken);
  if(isTaken === null){
    return false;
  }
  return true;
}

/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err){
      return false;
    }
    return true;
  });
};



/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * 
 */
const User = mongoose.model("users", userSchema);

module.exports = {User};
