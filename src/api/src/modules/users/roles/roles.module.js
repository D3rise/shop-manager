const { BaseModule } = require("../../base/module.base");

class RolesModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  static get ROLES() {
    return ["BUYER", "CASHIER", "PROVIDER", "SHOP", "BANK", "ADMIN"]
  }

  getRoleId(roleName) {
    return this.web3.utils.getKeyByValue(RolesModule.ROLES, roleName)
  }
}

module.exports = { RolesModule }