const { Web3Contract } = require("./contract");

class API {
  constructor(web3Endpoint) {
    return (async () => {
      this.web3 = await new Web3Contract(web3Endpoint);
      this.contract = this.web3.contract;
      this.__initClasses();
      return this
    })()
  }

  async authenticate(username, password, secret) {
    const address = await this.contract.methods.getUserAddress(username).call();
    const { web3 } = this.web3;

    await web3.eth.personal.unlockAccount(address, password);

    const secretHash = web3.utils.sha3(secret);
    const success = await this.contract.methods
      .authenticateUser(username, secretHash)
      .call();

    if (success) {
      await this.web3.changeUser(address);
      return address;
    }
  }

  __initClasses() {
    this.users = this.web3.users;
    this.shops = this.web3.shops;
    this.reviews = this.web3.reviews;
    this.bank = this.web3.bank;
    this.utils = this.web3.utils;
  }
}

module.exports = { API };
