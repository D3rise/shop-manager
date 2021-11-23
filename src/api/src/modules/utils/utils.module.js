const { BaseModule } = require("../base/module.base");

class UtilsModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  toBN(number) {
    return this.web3.web3.utils.toBN(number)
  }

  toWei(value, unit) {
    return this.web3.web3.utils.toWei(value, unit)
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value)
  }
}

module.exports = { UtilsModule }