import { capitalizeString } from ".";
import { addUser } from "./users";

export const addShop = async (web3, contract, city, password, secret, from) => {
  const address = await addUser(
    web3,
    contract,
    city,
    web3.utils.sha3(password),
    web3.utils.sha3(secret),
    `${capitalizeString(city)} Shop`
  );
  await contract.methods
    .newShop(capitalizeString(city), address)
    .send({ from });

  return contract.methods.getShopByCity(capitalizeString(city)).call();
};

export const removeShop = async (contract, city, from) => {
  await contract.methods.deleteShop(city).send({ from });
};
