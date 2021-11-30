const { Roles } = require("../../constant/roles");
const { BaseEntity } = require("../base/entity.base");
const { Shop } = require("../shops/shop.class");

class User extends BaseEntity {
  constructor(web3, address) {
    super(web3);
    this.address = address;

    return (async () => {
      await this._initData();
      return this;
    })();
  }

  getUsername() {
    return this.data.username;
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

  changeRole(roleName) {
    const roleId = this.web3.users.roles.getRoleId(roleName);
    return this.contract.methods
      .changeRole(this.web3.userAddress, roleId, "", false)
      .send({ from: this.web3.userAddress });
  }

  isNull() {
    return !this.data.exists;
  }

  async _initData() {
    this.data = await this.contract.methods.getUser(this.address).call();
  }
}

module.exports = { User };
