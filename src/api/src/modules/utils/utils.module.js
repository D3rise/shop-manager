const { BaseModule } = require("../base/module.base");
const reserveAccount = require("../../constant/reserveAccount");

class UtilsModule extends BaseModule {
  constructor(web3) {
    super(web3);
    this.__unlockReserveAccount();
  }

  toBN(number) {
    return this.web3.web3.utils.toBN(number);
  }

  toWei(value, unit) {
    return this.web3.web3.utils.toWei(value, unit);
  }

  sha3(str) {
    return this.web3.web3.utils.sha3(str);
  }

  capitalizeString(str) {
    return str.at(0).toUpperCase() + str.slice(1);
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  transferFromReserveAccount(address, amount) {
    return this.web3.web3.eth.sendTransaction({
      from: reserveAccount.address,
      to: address,
      value: amount,
    });
  }

  __unlockReserveAccount() {
    return this.web3.web3.eth.personal.unlockAccount(
      reserveAccount.address,
      reserveAccount.password,
      0
    );
  }
}

module.exports = { UtilsModule };
