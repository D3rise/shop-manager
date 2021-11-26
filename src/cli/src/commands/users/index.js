const fs = require("fs");

const login = () => {
  return {
    args: 3,
    func: async (username, password, secret) => {
      const address = await api.authenticate(username, password, secret);
      if (address) {
        writeUserData({ username, password, secret, address });
        const user = await api.users.getUser(address);
        console.log(`Authenticated as ${user.getUsername()}`);
      }
    },
  };
};

const signUp = () => {
  return {
    args: 4,
    func: async (username, fullName, password, secret) => {
      const address = await api.users.addUser(
        username,
        fullName,
        password,
        secret
      );

      writeUserData({ username, password, secret, address });
      console.log("Successfully signed up!");
    },
  };
};

const showUser = () => {
  return {
    args: 0,
    func: async (username) => {
      let address;

      if (!username && userData.address) address = userData.address;
      else if (username) address = await api.users.getUserAddress(username);
      else throw new Error("Insufficient arguments! Required 1");

      const userInfo = await api.users.getUser(address);

      username = userInfo.getUsername();
      const [roleId, role] = userInfo.getRole();
      const [maxRoleId, maxRole] = userInfo.getMaxRole();
      const { shop } = userInfo.data;
      const [userExists, reviewIds] = await api.reviews.getUserReviewIds(
        address
      );

      console.log(
        `User: ${username}\n\tRole: ${role}\n\tMax role: ${maxRole}\n\tShop: ${shop} Shop\n\tReviews (IDs): ${reviewIds.join(
          ", "
        )}`
      );
    },
  };
};

const writeUserData = (userData) => {
  fs.writeFileSync("./userdata.txt", JSON.stringify(userData));
  global.userData = userData;
};

module.exports = { login, signUp, writeUserData, showUser };
