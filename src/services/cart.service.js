const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { getProductById} = require("./product.service");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

const isProductInCart = (cart, productId) => {
  for(let i = 0; i < cart.cartItems.length; ++i){
    if(cart.cartItems[i].product._id == productId){
      return i;
    }
  }
  return -1;
}

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  const cart = await Cart.findOne({email: user.email});
  if(cart){
    return cart;
  }
  throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  var cart;
  try{
    cart = await getCartByUser(user);
  }
  catch(err){
    cart = await Cart.create({
      email: user.email,
      cartItems: [],
    });
    if(!cart){
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "500 Internal Server Error");
    }
  }
  const product = await getProductById(productId);
  if(!product){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }
  const inCart = isProductInCart(cart, productId);
  if(inCart != -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart");
  }
  cart.cartItems.push(
    {
      product: product,
      quantity: quantity,
    });
  await cart.save();
  return cart;
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  var cart;
  try{
    cart = await getCartByUser(user);
  }
  catch(err){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product");
  }
  const product = await getProductById(productId);
  if(!product){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }
  const inCart = isProductInCart(cart, productId);
  if(inCart == -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  cart.cartItems[inCart].quantity = quantity;
  await cart.save();
  return cart;
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  var cart;
  try{
    cart = await getCartByUser(user);
  }
  catch(err){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }
  var inCart = isProductInCart(cart, productId);
  if(inCart == -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  cart.cartItems.splice(inCart, 1);
  await cart.save();
  return cart;
};

const getCartPrice = (cart) => {
  var price = 0;
  for(let i = 0; i < cart.cartItems.length; ++i){
    price += cart.cartItems[i].product.cost;
  }
  return price;
}

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  var cart;
  try{
    cart = await getCartByUser(user);
  }
  catch(err){
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  if(cart.cartItems.length==0){
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart does not have any items");
  }
  else if(!(await user.hasSetNonDefaultAddress())){
    throw new ApiError(httpStatus.BAD_REQUEST, "Please set your address first");
  }
  const cartMoney = getCartPrice(cart);
  if(cartMoney > user.walletMoney){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have enough money in wallet");
  }
  cart.cartItems = [];
  await cart.save();
  user.walletMoney = user.walletMoney - cartMoney;
  await user.save();
  return cart;
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
