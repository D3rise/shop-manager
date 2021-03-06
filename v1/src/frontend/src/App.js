import { Route, Routes } from "react-router";
import { Header } from "./component/header";
import { Context } from "./hook/context";
import { useLocalStorage } from "./hook/localStorage";
import Web3 from "web3";
import { Abi } from "./contract";
import { Home } from "./page/home";
import { Shop } from "./page/shop";
import { Login } from "./page/login";
import { Signup } from "./page/signup";
import { unlockReserve } from "./utils/users";
import { Logout } from "./page/logout";
import { Dashboard } from "./page/dashboard";
import { changeRole, Roles } from "./utils/roles";
import { getKeyByValue } from "./utils";

export const App = () => {
  const web3 = new Web3(process.env.REACT_APP_GETH_ENDPOINT);
  const contract = new web3.eth.Contract(
    Abi,
    process.env.REACT_APP_GETH_CONTRACT_ADDRESS
  );
  unlockReserve(web3);

  const [user, setUser] = useLocalStorage("user", {
    username: "",
    address: "",
    role: "",
    maxRole: "",
    balance: "",
  });

  const handleRoleChange = (role) => {
    changeRole(
      contract,
      user.address,
      user.address,
      getKeyByValue(Roles, role)
    ).then(() => {
      setUser({ ...user, role: getKeyByValue(Roles, role) });
    });
  };

  return (
    <Context.Provider value={{ web3, contract, user, setUser }}>
      <div className="App">
        <Header
          username={user.username}
          role={user.role}
          maxRole={user.maxRole}
          balance={user.balance}
          onChangeRole={handleRoleChange}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:city" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Context.Provider>
  );
};
