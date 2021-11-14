import { useContext } from "../../hook/context";
import { useEffect, useState } from "react";
import { addUser } from "../../utils/users";
import { useNavigate } from "react-router";

export const Signup = () => {
  const navigate = useNavigate();
  const { user, setUser, contract, web3, setLoading } = useContext();
  const [credentials, setCredentials] = useState({
    username: null,
    fullName: null,
    password: null,
    secret: null,
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
    const { username, fullName, password, secret } = credentials;
    setLoading(true);
    try {
      const address = await addUser(
        web3,
        contract,
        username,
        password,
        secret,
        fullName
      );
      setUser({ username, address });
      setLoading(false);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="signup_form">
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            name="fullName"
            value={credentials.fullName}
            onChange={handleChange}
          />
        </label>
        <br />
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
            value={credentials.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Secret:
          <input
            name="secret"
            value={credentials.secret}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
