const { API } = require("../src/api");

let api;
jest.mock("../src/api");

describe("api", () => {
  beforeAll(() => {
    api = new API();
  });

  it("should log 2 + 2", () => {
    expect(api.users).not.toBeNull();
  });
});
