export const addUser = async (
  web3,
  contract,
  username,
  password,
  secret,
  fullName
) => {
  const userExists = (
    await contract.methods
      .getUser(await contract.methods.getUserAddress(username).call())
      .call()
  )[0];
  if (userExists) throw new Error("User exists!");

  const passwordHash = web3.utils.keccak256(
    web3.eth.abi.encodeParameter("string", password)
  );
  const secretHash = web3.utils.keccak256(
    web3.eth.abi.encodeParameter("string", secret)
  );

  const address = await web3.eth.personal.newAccount(password);
  await web3.eth.personal.unlockAccount(address, password, 0);

  await transferFromReserve(web3, address, web3.utils.toWei("2", "ether"));

  await contract.methods
    .newUser(address, username, fullName, passwordHash, secretHash)
    .send({ from: address });

  return address;
};

export const transferFromReserve = async (web3, toAddress, countInWei) => {
  const reserveAddress = process.env.REACT_APP_GETH_RESERVE_ACCOUNT_ADDRESS;
  return web3.eth.sendTransaction({
    from: reserveAddress,
    to: toAddress,
    value: countInWei,
  });
};

export const unlockReserve = async (web3) => {
  const reserveAddress = process.env.REACT_APP_GETH_RESERVE_ACCOUNT_ADDRESS;
  const reservePassword = process.env.REACT_APP_GETH_RESERVE_ACCOUNT_PASSWORD;

  await web3.eth.personal.unlockAccount(reserveAddress, reservePassword, 0);
};
