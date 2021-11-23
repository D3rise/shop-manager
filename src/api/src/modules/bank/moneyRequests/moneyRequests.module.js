const { BaseModule } = require("../../base/module.base")

class MoneyRequestsModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  getMoneyRequest(city) {
    return this.contract.methods.getMoneyRequest(city).call({ from: this.web3.userAddress })
  }

  getMoneyRequests() {
    return this.contract.methods.getMoneyRequests().call({ from: this.web3.userAddress })
  }

  newMoneyRequest(amountInEther) {
    const amountInWei = this.web3.web3.utils.toWei(String(amountInEther), "ether");
    return this.contract.methods.newMoneyRequest(amountInWei).send({ from: this.web3.userAddress })
  }

  cancelMoneyRequest() {
    return this.contract.methods.cancelMoneyRequest().send({ from: this.web3.userAddress })
  }

  approveMoneyRequest(city) {
    return this.__operateMoneyRequest(city, true)
  }

  denyMoneyRequest(city) {
    return this.__operateMoneyRequest(city, false)
  }

  async __operateMoneyRequest(city, accept) {
    const request = await this.getMoneyRequest(city)
    if(!request.exists) {
      throw new Error("This city didn't sent any money requests!")
    }
    return this.contract.methods.approveMoneyRequest(city, accept).send({ from: this.web3.userAddress, value: request.count })
  }
}

module.exports = { MoneyRequestsModule }