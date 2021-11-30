const { BaseModule } = require("../base/module.base");
const { Shop } = require("./shop.class");

class ShopsModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  async addShop(city, password, secret) {
    const existingShop = await this.web3.shops.getShop(city);
    if (!existingShop.isNull()) throw new Error("Such shop already exists");

    const actualCity = this.web3.utils.capitalizeString(city);
    const address = await this.web3.users.addUser(
      city,
      `${city} Shop`,
      password,
      secret
    );

    await this.web3.contract.methods
      .newShop(actualCity, address)
      .send({ from: address });
    return actualCity;
  }

  removeShop(city) {
    return this.contract.methods.deleteShop(city);
  }

  getShop(city) {
    return new Shop(this.web3, city);
  }

  getShopCities() {
    return this.contract.methods.getShops().call();
  }
}

module.exports = { ShopsModule };
