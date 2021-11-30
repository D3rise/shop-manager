const { API } = require("../../src/api");
let api;

describe("users", () => {
  beforeAll(() => {
    api = new API("http://localhost:8545");
  });

  it("should return user", async () => {
    const address = await api.users.getUserAddress("petr");
    const user = await api.users.getUser(address);

    expect(user.isNull()).toBeFalsy();
    expect(user.data.username).toEqual("petr");
  });

  it("should return null user", async () => {
    const address = await api.users.getUserAddress("petrovich");
    const user = await api.users.getUser(address);

    expect(user.isNull()).toBeTruthy();
    expect(user.data.username).toBe("");
  });

  it("should return user shop", async () => {
    const address = await api.users.getUserAddress("semen");
    const user = await api.users.getUser(address);

    const shop = await user.getShop();
    expect(shop.data.shopCity).toBe("Dmitrov");
  });

  it("should return user role and max role", async () => {
    await api.authenticate("semen", "123", "12345");
    const address = await api.users.getUserAddress("semen");
    const user = await api.users.getUser(address);
    await user.changeRole("CASHIER");

    expect(user.getRole()).toEqual(["1", "CASHIER"]);
    expect(user.getMaxRole()).toEqual(["1", "CASHIER"]);
  }, 60000);

  it("should return username", async () => {
    const address = await api.users.getUserAddress("semen");
    const user = await api.users.getUser(address);

    expect(user.getUsername()).toBe("semen");
  });

  it("should change role", async () => {
    await api.authenticate("semen", "123", "12345");
    let user = await api.users.getUser(api.web3.userAddress);

    await user.changeRole("BUYER");
    user = await api.users.getUser(api.web3.userAddress);
    expect(user.getRole()).toEqual(["0", "BUYER"]);
  }, 60000);
});
