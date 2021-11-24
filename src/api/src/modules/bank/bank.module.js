const { BaseModule } = require("../base/module.base");
const { MoneyRequestsModule } = require("./moneyRequests/moneyRequests.module");

class BankModule extends BaseModule {
  constructor(web3) {
    super(web3);
    this._initModules();
  }

  _initModules() {
    this.moneyRequests = new MoneyRequestsModule(this.web3);
  }

  getBalance(address) {
    return this.web3.web3.eth.getBalance(address);
  }

  getSelfBalance() {
    return this.getBalance(this.web3.userAddress);
  }
}

module.exports = { BankModule };
