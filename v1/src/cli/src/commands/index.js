const users = require("./users");
const shops = require("./shops");

const commands = {
  login: users.login(),
  signup: users.signUp(),

  showUser: users.showUser(),

  showShops: shops.showShops(),
  showShop: shops.showShop(),
  newShop: (city, password, secret) => null,
  removeShop: (city) => null,

  addReview: (city, content, rating) => null,
  addAnswer: (city, content, reviewId) => null,
  likeReview: (reviewId) => null,
  dislikeReview: (reviewId) => null,

  changeRole: (role) => null,
  changeUserRole: (userAddress, role) => null,

  getElevateRequests: () => null,
  approveElevateRequest: (username) => null,
  denyElevateRequest: (username) => null,

  getMoneyRequests: () => null,
  approveMoneyRequest: (city) => null,
  denyMoneyRequest: (city) => null,
};

module.exports = commands;
