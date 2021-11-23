const { API } = require("../../src/api");
let api;

describe("reviews", () => {
  beforeAll(async () => {
    api = new API("http://localhost:8545");
    await api.authenticate("petr", "123", "12345")
  });

  it("should return user reviews", async() => {
    const userReviews = await api.reviews.getUserReviewIds(api.web3.userAddress)
    expect(userReviews[1].length).toBeGreaterThanOrEqual(0);
  }, 60000)

  it("should create new review", async () => {
    const shop = await api.shops.getShop("Dmitrov")
    const review = await api.reviews.newReview(shop, "Nice!", 10)

    expect(review.isNull()).toBeFalsy();
    expect(review.data.content).toBe("Nice!")
  }, 60000)

  it("should create new answer", async () => {
    const shop = await api.shops.getShop("Dmitrov")
    const review = await api.reviews.newReview(shop, "Nice!", 10)

    const answer = await api.reviews.newAnswer(shop, review, "Thanks!")

    expect(answer.isNull()).toBeFalsy()
    expect(answer.data.content).toBe("Thanks!")
  }, 60000)
});