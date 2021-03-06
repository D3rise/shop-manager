const showShops = () => {
  return {
    args: 0,
    async func() {
      const shops = await api.shops.getShopCities();
      console.log("Shops:");
      shops.map((shop, index) => {
        console.log(`\t${index + 1}. ${shop}`);
      });
    },
  };
};

const showShop = () => {
  return {
    args: 1,
    async func(city) {
      const shop = await api.shops.getShop(city);
      const { shopOwner: ownerAddress } = shop.data;
      const cashiers = await shop.getCashiers();
      const reviewIds = await api.reviews.getShopReviewIds(city);
      const reviews = await Promise.all(
        reviewIds.map((id) => api.reviews.getReview(id))
      );

      console.log(
        `${city} Shop:\n\tCashiers:\n\t\t${cashiers
          .map((user, index) => `${index + 1}. ${user.getUsername()}`)
          .join("\n\t\t")}\n\tReviews:\n\t\t${reviews.map((review) => ``)}`
      );
    },
  };
};

const newShop = () => {
  return {
    args: 3,
    func() {},
  };
};

module.exports = { showShop, showShops };
