const { BaseModule } = require("../base/module.base");
const { User } = require("./user.class");

class UsersModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  async getUserLogins() {
    return await this.contract.methods.getUserLogins().call();
  }

  async getUserAddress(username) {
    return await this.contract.methods.getUserAddress(username).call();
  }

  async getUser(userAddress) {
    return new User(this.web3, userAddress);
  }
}

module.exports = { UsersModule };
