const { BaseEntity } = require("../base/entity.base");

class User extends BaseEntity {
  constructor(web3, address) {
    super(web3);

    this.address = address;
  }

  changeRole(role) {
    this.contract.methods.changeRole(role).send({ from: this.web3.user });
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getUser(this.address).call();
  }
}

module.exports = { User };
