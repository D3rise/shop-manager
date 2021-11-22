const { BaseModule } = require("../base/module.base");
const { User } = require("./user.class");

class UsersModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  async getUserLogins() {
    return await this.contract.methods.getUserLogins().call();
  }

  getUser(userAddress) {
    return new User(web3, this.contract, userAddress);
  }
}

module.exports = { UsersModule };
