const { BaseEntity } = require("../base/entity.base");

class Review extends BaseEntity {
  constructor(web3, id) {
    super(web3);
    this.id = id;

    return (async () => {
      await this._initData();
      return this;
    })();
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getReview(this.id).call();
  }
}

module.exports = { Review };
