class BaseEntity {
  constructor(web3) {
    this.web3 = web3;
    this.contract = web3.contract;
  }
  isNull() {}
  _initData() {}
}

module.exports = { BaseEntity };
