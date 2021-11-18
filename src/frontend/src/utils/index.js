import web3utils from "web3-utils";

export const capitalizeString = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const generateBytes32Hash = (str) => {
  return web3utils.sha3(str);
};
