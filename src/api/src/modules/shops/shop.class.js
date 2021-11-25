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

  async getCashiers() {
    const users = await this.web3.users.getUserLogins();

    const cashiersAddresses = users.map(async (username) => {
      const address = await this.web3.users.getUserAddress(username);
      const user = await this.web3.users.getUser(address);

      if (user.data.shop === this.city && user.getMaxRole()[1] === "CASHIER") {
        return address;
      }
    });

    const cashiers = await Promise.all(cashiersAddresses).then(
      (result) =>
        result
          .filter((user) => user) // check if undefined/null or not
          .map((address) => this.web3.users.getUser(address)) // get user class from address
    );

    return Promise.all(cashiers);
  }

  async _initData() {
    this.data = await this.contract.methods.getShopByCity(this.city).call();
  }
}

module.exports = { Shop };
