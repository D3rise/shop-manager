const { API } = require("../../../src/api");

let api;
describe("bank.moneyRequests", () => {
  beforeAll(async () => {
    api = new API("http://localhost:8545");
  });

  it("should create new money request", async () => {
    await api.authenticate("ryazan", "123", "12345");
    await api.bank.moneyRequests.cancelMoneyRequest();
    await api.bank.moneyRequests.newMoneyRequest(100);
    await api.authenticate("bank", "123", "12345");

    const result = await api.bank.moneyRequests.getMoneyRequest("Ryazan");
    expect(result.count).toBe("100000000000000000000");
  }, 60000);

  it("should return null moneyRequest", async () => {
    await api.authenticate("bank", "123", "12345");
    const result = await api.bank.moneyRequests.getMoneyRequest("Taganrog");
    expect(result.exists).toBeFalsy();
  });

  it("should approve moneyRequest", async () => {
    await api.authenticate("dmitrov", "123", "12345");
    await api.bank.moneyRequests.cancelMoneyRequest();
    await api.bank.moneyRequests.newMoneyRequest(100);

    await api.authenticate("bank", "123", "12345");
    await api.bank.moneyRequests.approveMoneyRequest("Dmitrov");

    const address = await api.users.getUserAddress("dmitrov");
    const result = await api.web3.web3.eth.getBalance(address);

    const expectedValue = api.utils.toWei("100", "ether");
    expect(api.utils.toBN(result).gte(expectedValue)).toBeTruthy();
  }, 60000);

  it("should deny moneyRequest", async () => {
    await api.authenticate("ryazan", "123", "12345");
    await api.bank.moneyRequests.cancelMoneyRequest();
    await api.bank.moneyRequests.newMoneyRequest(100);

    const address = await api.users.getUserAddress("ryazan");
    const expectedValue = await api.bank.getSelfBalance();

    await api.authenticate("bank", "123", "12345");
    await api.bank.moneyRequests.denyMoneyRequest("Ryazan");

    const result = await api.bank.getBalance(address);
    expect(result).toBe(expectedValue);
  }, 60000);
});
