const { BaseModule } = require("../base/module.base");
const { ReviewsModule } = require("./reviews/reviews.module");
const { Shop } = require("./shop.class");

class ShopsModule extends BaseModule {
  constructor(web3) {
    super(web3);

    this.reviews = new ReviewsModule(web3);
  }

  getShop(city) {
    return new Shop(this.web3, this.contract, city);
  }

  async getShopsCities() {
    return await this.contract.methods.getShops().call();
  }
}

module.exports = { ShopsModule };
