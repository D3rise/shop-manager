const { API } = require("../src/api");
let api;

describe("users", () => {
  beforeAll(() => {
    api = new API("http://localhost:8545");
  });

  it("should return user", async () => {
    const address = await api.users.getUserAddress("petr");
    const user = await api.users.getUser(address);

    expect(user.isNull()).toBeFalsy()
    expect(user.data.username).toEqual("petr")
  });

  it("should return null user", async () => {
    const address = await api.users.getUserAddress("petrovich");
    const user = await api.users.getUser(address);

    expect(user.isNull()).toBeTruthy()
    expect(user.data.username).toBe("")
  })
})