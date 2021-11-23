const { BaseModule } = require("../base/module.base");
const { User } = require("./user.class");
const { RolesModule } = require("./roles/roles.module");

class UsersModule extends BaseModule {
  constructor(web3) {
    super(web3);

    this.__initClasses()
  }

  async getUserLogins() {
    return await this.contract.methods.getUserLogins().call();
  }

  async getUserAddress(username) {
    return await this.contract.methods.getUserAddress(username).call();
  }

  async getUser(userAddress) {
    return new User(this.web3, userAddress, this);
  }

  __initClasses() {
    this.roles = new RolesModule(this.web3)
  }
}

module.exports = { UsersModule };
