const { Web3Contract } = require("./contract");

class API {
  constructor(web3Endpoint) {
    this.web3 = new Web3Contract(web3Endpoint);
    this.contract = this.web3.contract;
    this.__initClasses();
  }

  authenticate(username, password, secret) {
    return this.users.authenticateUser(username, password, secret);
  }

  __initClasses() {
    this.users = this.web3.users;
    this.shops = this.web3.shops;
    this.reviews = this.web3.reviews;
    this.bank = this.web3.bank;
    this.utils = this.web3.utils;
  }
}

module.exports = { API };
