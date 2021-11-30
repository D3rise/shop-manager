const { BaseModule } = require("../base/module.base");
const { User } = require("./user.class");
const { RolesModule } = require("./roles/roles.module");

class UsersModule extends BaseModule {
  constructor(web3) {
    super(web3);

    this.__initClasses();
  }

  async authenticateUser(username, password, secret) {
    const address = await this.contract.methods.getUserAddress(username).call();
    const { web3 } = this.web3;

    await web3.eth.personal.unlockAccount(address, password);

    const success = await this.contract.methods
      .authenticateUser(username, secret)
      .call();

    if (success) {
      await this.web3.changeUser(address);
      return address;
    }
  }

  async addUser(username, fullName, password, secret) {
    const actualUsername = username.toLowerCase();
    const existingAddress = await this.getUserAddress(actualUsername);
    if (!this.web3.utils.toBN(existingAddress).isZero()) {
      throw new Error("Such user already exists!");
    }

    const secretHash = this.web3.utils.sha3(secret);
    const address = await this.web3.web3.eth.personal.newAccount(password);
    await this.web3.web3.eth.personal.unlockAccount(address, password);

    await this.web3.utils.transferFromReserveAccount(
      address,
      this.web3.utils.toWei("0.1", "ether")
    );

    await this.web3.contract.methods
      .newUser(address, username, fullName, secretHash)
      .send({ from: address });
    return address;
  }

  getUserLogins() {
    return this.contract.methods.getUserLogins().call();
  }

  async getUserAddress(username) {
    return await this.contract.methods.getUserAddress(username).call();
  }

  async getUser(userAddress) {
    return new User(this.web3, userAddress, this);
  }

  getElevateRequest(address) {
    return this.contract.methods
      .getElevateRequest(address)
      .call({ from: this.web3.userAddress });
  }

  getElevateRequests() {
    return this.contract.methods
      .getElevateRequests()
      .call({ from: this.web3.userAddress });
  }

  __initClasses() {
    this.roles = new RolesModule(this.web3);
  }
}

module.exports = { UsersModule };
