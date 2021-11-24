const { API } = require("../../src/api");
let api;

describe("shops", () => {
  beforeAll(() => {
    api = new API("http://localhost:8545");
  });

  it("should return shop", async () => {
    const shop = await api.shops.getShop("Taganrog");

    expect(shop.isNull()).toBeFalsy();
    expect(shop.data.shopCity).toBe("Taganrog");
  });

  it("should return shop cities", async () => {
    const shopsCities = await api.shops.getShopCities();

    expect(shopsCities.length).toBeGreaterThanOrEqual(1);
    expect(shopsCities).toContain("Dmitrov");
  });
});
