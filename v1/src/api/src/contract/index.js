const Web3 = require("web3");
const { ABI, contractAddress } = require("./config");
const { User } = require("../modules/users/user.class");
const { UtilsModule } = require("../modules/utils/utils.module");
const { UsersModule } = require("../modules/users/users.module");
const { ShopsModule } = require("../modules/shops/shops.module");
const { ReviewsModule } = require("../modules/reviews/reviews.module");
const { BankModule } = require("../modules/bank/bank.module");

class Web3Contract {
  constructor(web3Endpoint) {
    this.web3 = new Web3(web3Endpoint);
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);

    this.__initUser();
    this.__initClasses();
  }

  async changeUser(address) {
    this.userAddress = address;
    this.user = await new User(this, address);
  }

  __initClasses() {
    this.users = new UsersModule(this);
    this.shops = new ShopsModule(this);
    this.reviews = new ReviewsModule(this);
    this.bank = new BankModule(this);
    this.utils = new UtilsModule(this);
  }

  __initUser() {
    this.userAddress = null;
    this.user = null;
  }
}

module.exports = { Web3Contract };
