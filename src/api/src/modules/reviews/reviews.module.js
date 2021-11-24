const { BaseModule } = require("../base/module.base");
const { Review } = require("./review.class");

class ReviewsModule extends BaseModule {
  constructor(web3) {
    super(web3);
  }

  async newReview(shop, content, rating) {
    await this.contract.methods
      .newReview(shop.data.shopCity, content, rating, 0)
      .send({ from: this.web3.userAddress });
    const reviewId = (await this.getUserReviewIds(this.web3.userAddress))[1].at(
      -1
    );
    return new Review(this.web3, reviewId);
  }

  async newAnswer(shop, review, content) {
    await this.contract.methods
      .newReview(shop.data.shopCity, content, 0, review.id)
      .send({ from: this.web3.userAddress });
    const reviewId = (await this.getUserReviewIds(this.web3.userAddress))[1].at(
      -1
    );
    return new Review(this.web3, reviewId);
  }

  getReview(id) {
    return new Review(this.web3, this.contract, id);
  }

  async getShopReviewIds(city) {
    const { exists, reviewIds } = await this.contract.methods
      .getShopReviews(city)
      .call();
    return [exists, reviewIds];
  }

  async getUserReviewIds(userAddress) {
    const { exists, reviewIds } = await this.contract.methods
      .getUserReviews(userAddress)
      .call();
    return [exists, reviewIds];
  }
}

module.exports = { ReviewsModule };
