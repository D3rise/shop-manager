const { BaseEntity } = require("../base/entity.base");

class Review extends BaseEntity {
  constructor(web3, id) {
    super(web3);
    this.id = id;

    return (async () => {
      await this._initData();
      return this;
    })();
  }

  isNull() {
    return !this.data.exists;
  }

  getContent() {
    return this.data.content;
  }

  getParent() {
    return this.web3.reviews.getReview(this.data.answer);
  }

  getAnswers() {
    return Promise.all(this.data.answers.map(this.web3.reviews.getReview));
  }

  async _initData() {
    this.data = await this.contract.methods.getReview(this.id).call();
  }
}

module.exports = { Review };
