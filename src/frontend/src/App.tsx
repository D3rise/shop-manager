import React from "react";
import Web3 from "web3";
import { Routes, Route } from "react-router-dom";
import { About } from "./pages/about/about.component";
import { Header } from "./components/header/header.component";
import { Home } from "./pages/home/home.component";
import { Login } from "./pages/login/login.component";
import { Context, useLocalStorage } from "./hooks/storage";
import { Abi } from "./contract";
import { Signup } from "./pages/signup/signup.component";
import { Dashboard } from "./pages/dashboard/dashboard.component";
import { Shops } from "./pages/shops/shops.component";
import { Logout } from "./pages/logout/logout.component";
import { ShopPage } from "./pages/shop/shopPage.component";

function App() {
  const web3 = new Web3(process.env.REACT_APP_GETH_HTTP_ENDPOINT!);
  const contract = new web3.eth.Contract(
    Abi,
    process.env.REACT_APP_CONTRACT_ADDRESS
  );

  const [user, setUser] = useLocalStorage("user", {
    login: null,
    address: null,
    role: null,
  });

  return (
    <Context.Provider value={{ web3, contract, user, setUser }}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/shop/:name" element={<ShopPage />} />
        </Routes>
      </div>
    </Context.Provider>
  );
}

export default App;
