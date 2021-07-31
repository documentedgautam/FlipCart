const mongoose = require('mongoose');
const { productSchema } = require('./product.model');
const config = require("../config/config")
const { User } = require('./user.model').User
const validator = require("validator");

// TODO: CRIO_TASK_MODULE_CART - Complete cartSchema, a Mongoose schema for "carts" collection
const cartSchema = mongoose.Schema(
  {
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
    cartItems: {
      type: [
        {
          product: productSchema,
          quantity: Number,
        },
      ],
    },
    paymentOption: {
      type: String,
      default: config.default_payment_option,
    }
  },
  {
    timestamps: false,
  }
);


/**
 * @typedef Cart
 */
const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;