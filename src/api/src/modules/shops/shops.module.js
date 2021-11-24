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

  async addShop(city, password, secret) {
    const existingShop = await this.web3.shops.getShop(city)
    if(!existingShop.isNull()) throw new Error("Such shop already exists")

    const address = await this.web3.users.addUser(city, `${city} Shop`, password, secret)
    await this.web3.contract.methods.newShop(city, address).send({ from: address })
    return
  }

  getShop(city) {
    return new Shop(this.web3, city);
  }

  async getShopCities() {
    return await this.contract.methods.getShops().call();
  }
}

module.exports = { ShopsModule };
