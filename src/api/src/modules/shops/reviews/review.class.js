const { BaseEntity } = require("../../base/entity.base");

class Review extends BaseEntity {
  constructor(web3, contract, id) {
    super();
    this.web3 = web3;
    this.contract = contract;
    this.id = id;

    this._initData();
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getReview(this.id).call();
  }
}

module.exports = { Review };
