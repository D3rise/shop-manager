const { BaseModule } = require("../base/module.base");
const { ReviewsModule } = require("../reviews/reviews.module");
const { Shop } = require("./shop.class");

/**
 * TODO:
 * 1. Add shop
 * 2. Remove shop
 */

class ShopsModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  getShop(city) {
    return new Shop(this.web3, city);
  }

  async getShopCities() {
    return await this.contract.methods.getShops().call();
  }
}

module.exports = { ShopsModule };
