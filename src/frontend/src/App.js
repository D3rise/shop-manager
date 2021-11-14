import { Route, Routes } from "react-router";
import { useState } from "react";
import { Header } from "./component/header";
import { Context } from "./hook/context";
import { useLocalStorage } from "./hook/localStorage";
import Web3 from "web3";
import { Abi } from "./contract";
import { Home } from "./page/home";
import { Shop } from "./page/shop";
import { Login } from "./page/login";
import { Signup } from "./page/signup";

export const App = () => {
  const web3 = new Web3(process.env.REACT_APP_GETH_ENDPOINT);
  const contract = new web3.eth.Contract(
    Abi,
    process.env.REACT_APP_GETH_CONTRACT_ADDRESS
  );

  const [user, setUser] = useLocalStorage("user", {
    username: null,
    address: null,
  });
  const [loading, setLoading] = useState(false);

  return (
    <Context.Provider
      value={{ web3, contract, user, setUser, loading, setLoading }}
    >
      <div className="App">
        <Header username={user.username} loading={loading} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:city" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Context.Provider>
  );
};
