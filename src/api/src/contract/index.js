const Web3 = require("web3");
const { ABI, contractAddress } = require("./config");

class Web3Contract {
  constructor(web3Endpoint) {
    this.web3 = new Web3(web3Endpoint);
    this.contract = new this.web3.eth.Contract(ABI, contractAddress);
  }
}

module.exports = { Web3Contract };
