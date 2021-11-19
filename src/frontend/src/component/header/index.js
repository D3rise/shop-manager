import { useState } from "react";
import { Link } from "react-router-dom";
import { fromWei } from "web3-utils";
import { getKeyByValue } from "../../utils";
import { Roles } from "../../utils/roles";
import "./index.scss";

export const Header = (props) => {
  const { username, role, maxRole, balance, onChangeRole } = props;
  const [selectedRole, setSelectedRole] = useState(Roles[maxRole]);

  const handleChange = (event) => {
    const { value: newSelectedRole } = event.currentTarget;
    setSelectedRole(newSelectedRole);
  };

  return (
    <div className="header">
      <div className="header_title">
        <h1>
          <Link to="/">Shop Manager</Link>
        </h1>
      </div>
      <div className="header_username">
        {username ? (
          <>
            Welcome, <b>{username}</b> | <Link to="/dashboard">Dashboard</Link>{" "}
            | <Link to="/logout">Log Out</Link>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link> | <Link to="/signup">Sign Up</Link>
          </>
        )}{" "}
      </div>
      <div className="header_balance" align="right">
        {username ? (
          <>
            <b>
              Current balance: {Math.floor(fromWei(balance, "ether"))} ether
            </b>
            <br />
            <b>Current role: {Roles[role]}</b>
            {role !== getKeyByValue(Roles, "BANK") &&
              role !== getKeyByValue(Roles, "SHOP") &&
              role !== getKeyByValue(Roles, "PROVIDER") && (
                <form onSubmit={() => onChangeRole()}>
                  <label>
                    Change role:
                    <select onChange={handleChange} value={selectedRole}>
                      {Roles.slice(0, maxRole + 1).map((role) => (
                        <>
                          <option value={role}>{role}</option>
                        </>
                      ))}
                    </select>
                  </label>
                  <button type="submit">Change</button>
                </form>
              )}
          </>
        ) : null}
      </div>

      <div className="header_navigator">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
