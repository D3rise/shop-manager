import { useContext } from "../../hook/context";
import { useEffect, useState } from "react";
import { addUser } from "../../utils/users";
import { useNavigate } from "react-router";

export const Signup = () => {
  const navigate = useNavigate();
  const { user, setUser, contract, web3 } = useContext();

  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    fullName: "",
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
    setLoading(true);
    event.preventDefault();
    const { username, fullName, password, secret } = credentials;

    console.log(credentials);
    if (fullName.split(" ").length < 3) {
      return alert("Full Name should contain three words!");
    }

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
      navigate("/");
    } catch (e) {
      setLoading(false);
      alert(e.message);
    }
  };

  return (
    <div className="signup_form">
      {loading && <h4>Loading....</h4>}
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
