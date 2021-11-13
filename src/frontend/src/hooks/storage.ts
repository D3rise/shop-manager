import { useContext as useReactContext, useState, createContext } from "react";
import Web3 from "web3";

interface IContext {
  web3?: Web3;
  contract?: any;
  user?: any;
  setUser?: any;
}

export const Context = createContext<IContext>({});

export const useContext = () => useReactContext(Context);

export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const getItem = localStorage.getItem(key);
      return getItem ? JSON.parse(getItem) : initialValue;
    } catch (e) {
      console.error(e);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(e);
    }
  };

  return [storedValue, setValue];
};
