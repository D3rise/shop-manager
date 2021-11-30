import { useEffect, useState } from "react";
import { useContext } from "../../../hook/context";
import { getKeyByValue, capitalizeString } from "../../../utils";
import { Roles } from "../../../utils/roles";

export const ChangeUserRoleForm = () => {
  const {
    contract,
    user: { address: from },
  } = useContext();
  const [state, setState] = useState({ username: "", role: 0, shop: "" });

  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);

  const getUsers = async () => {
    const actualUsers = await contract.methods.getUserLogins().call();

    const fullUsers = actualUsers.map(async (username) => {
      const address = await contract.methods.getUserAddress(username).call();
      return contract.methods.getUser(address).call();
    });

    setUsers(await Promise.all(fullUsers));
  };

  const getShops = async () => {
    const actualShops = await contract.methods.getShops().call();
    setShops(actualShops);
    setState({ ...state, shop: actualShops[0] });
  };

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setState({ ...state, [name]: value });
    console.log(state);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, role, shop } = state;
    try {
      const address = await contract.methods.getUserAddress(username).call();

      console.log(
        address,
        getKeyByValue(Roles, role),
        role === "CASHIER" ? shop : ""
      );

      await contract.methods
        .changeRole(
          address,
          getKeyByValue(Roles, role),
          role === "CASHIER" ? shop : "",
          true
        )
        .send({ from });
      alert(`Successfully changed role of ${username} to ${role}!`);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  useEffect(() => {
    getShops();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="change_user_role_form">
      <form onSubmit={handleSubmit}>
        <label>
          User:
          <br />
          <select
            name="username"
            onChange={handleChange}
            value={state.username}
          >
            {users.map(
              (user) =>
                user.role !== getKeyByValue(Roles, "SHOP") &&
                user.role !== getKeyByValue(Roles, "BANK") &&
                user.role !== getKeyByValue(Roles, "PROVIDER") && (
                  <>
                    <option value={user.username}>{user.username}</option>
                  </>
                )
            )}
          </select>
        </label>
        <br />
        <label>
          Role:
          <br />
          <select name="role" onChange={handleChange} value={state.role}>
            {Roles.map(
              (role) =>
                role !== "BANK" &&
                role !== "PROVIDER" &&
                role !== "SHOP" && (
                  <>
                    <option value={role}>{role}</option>
                  </>
                )
            )}
          </select>
        </label>
        {state.role === "CASHIER" && (
          <>
            <label>
              Shop:
              <br />
              <select name="shop" onChange={handleChange} value={state.shop}>
                {shops.map((shop) => (
                  <>
                    <option value={shop}>{capitalizeString(shop)}</option>
                  </>
                ))}
              </select>
            </label>
          </>
        )}
        <button type="submit">Change user role</button>
      </form>
    </div>
  );
};
