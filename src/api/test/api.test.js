const { API } = require("../src/api");

let api;

describe("api", () => {
  beforeAll(() => {
    api = new API("http://localhost:8545");
  });

  it("should authenticate", async () => {
    const address = await api.authenticate("petr", "123", "12345");

    expect(address).not.toBeNull();
    expect(api.web3.user).not.toBeNull();
  });
});
