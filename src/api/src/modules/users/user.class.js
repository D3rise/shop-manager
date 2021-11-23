const { Roles } = require("../../constant/roles");
const { BaseEntity } = require("../base/entity.base");
const { Shop } = require("../shops/shop.class");

class User extends BaseEntity {
  constructor(web3, address) {
    super(web3);

    return (async () => {
      this.address = address;
      await this._initData();
      return this
    })()
  }

  getUsername() {
    return
  }

  getMaxRole() {
    return [this.data.maxRole, Roles[this.data.maxRole]];
  }

  getRole() {
    return [this.data.role, Roles[this.data.role]];
  }

  getShop() {
    return new Shop(this.web3, this.data.shop);
  }

  changeRole(role) {
    this.contract.methods.changeRole(role).send({ from: this.web3.user });
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getUser(this.address).call()
  }
}

module.exports = { User };
