const { BaseModule } = require("../../base/module.base");
const { Review } = require("./review.class");

class ReviewsModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  getReview(id) {
    return new Review(web3, this.contract, id);
  }

  async getShopReviewIds(city) {
    return await this.contract.methods.getShopReviews(city).call();
  }

  async getUserReviewIds(userAddress) {
    return await this.contract.methods.getUserReviews(userAddress).call();
  }
}

module.exports = { ReviewsModule };
