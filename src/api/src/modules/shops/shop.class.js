const { BaseEntity } = require("../base/entity.base");

class Shop extends BaseEntity {
  constructor(web3, city) {
    super(web3);
    this.city = city;

    return (async () => {
      await this._initData();
      return this;
    })();
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getShopByCity(this.city).call();
  }
}

module.exports = { Shop };
