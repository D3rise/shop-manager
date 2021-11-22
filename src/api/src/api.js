const { Web3Contract } = require("./contract");
const { ShopsModule } = require("./modules/shops/shops.module");
const { UsersModule } = require("./modules/users/users.module");

class API {
  constructor(web3Endpoint) {
    this.web3 = new Web3Contract(web3Endpoint);
    this._initClasses();
  }

  _initClasses() {
    this.users = new UsersModule(this.web3);
    this.shops = new ShopsModule(this.web3);
  }
}

module.exports = { API };
