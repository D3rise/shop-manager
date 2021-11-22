const { BaseEntity } = require("../base/entity.base");

class User extends BaseEntity {
  constructor(web3, address) {
    super(web3);

    this.address = address;
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getUser(this.address).call();
  }
}

module.exports = { User };
