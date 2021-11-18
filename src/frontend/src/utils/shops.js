import { capitalizeString } from ".";
import { addUser } from "./users";

export const addShop = async (web3, contract, city, password, secret) => {
  const address = await addUser(
    web3,
    contract,
    city,
    web3.utils.sha3(password),
    web3.utils.sha3(secret),
    `${city.capitalize()} Shop`
  );
  await contract.methods
    .newShop(capitalizeString(city), address)
    .send({ from: address });

  return await contract.methods.getShop(capitalizeString(city)).call();
};

export const removeShop = async (contract, city, from) => {
  contract.methods.deleteShop(capitalizeString(city)).send({ from });
};
