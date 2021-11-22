const { BaseModule } = require("../base/module.base");

class BankModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }
}

module.exports = { BankModule };
