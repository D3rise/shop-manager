import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "../../hook/context";

export const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, contract, web3 } = useContext();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    secret: "",
  });

  useEffect(() => {
    if (user.address) navigate("/");
  });

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, password, secret } = credentials;
    const passwordHash = web3.utils.keccak256(
      web3.eth.abi.encodeParameter("string", password)
    );
    const secretHash = web3.utils.keccak256(
      web3.eth.abi.encodeParameter("string", secret)
    );

    console.log(passwordHash);

    try {
      const address = await contract.methods.getUserAddress(username).call();
      const authenticated = await web3.eth.personal.unlockAccount(address);

      if (authenticated) {
        await contract.methods
          .authenticateUser(username, passwordHash, secretHash)
          .call();
        setUser({ username, address });
      }
    } catch (e) {
      console.log(e);
      alert("Wrong username, password or secret!");
      setCredentials({ username, password: "", secret: "" });
    }
  };

  return (
    <div className="login_form">
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Secret:
          <input
            name="secret"
            type="password"
            value={credentials.secret}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};
