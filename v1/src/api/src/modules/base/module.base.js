class BaseModule {
  constructor(web3) {
    this.web3 = web3;
    this.contract = web3.contract;
  }
}

module.exports = { BaseModule };
