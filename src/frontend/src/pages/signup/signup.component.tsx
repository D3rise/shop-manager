import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "../../hooks/storage";

export const Signup = () => {
  const { web3, contract, user, setUser } = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.login) {
      navigate("/dashboard");
    }
  });

  const [state, setState] = useState({
    username: "",
    password: "",
    secret: "",
    fullName: "",
  });

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { username, password, secret, fullName } = state;

    contract.methods
      .getUserAddress(username.toLowerCase())
      .call()
      .then(async (res: any) => {
        if (await contract.methods.getUser(res).call()[0]) {
          return alert("Such user already exists!");
        }

        const address = await web3?.eth.personal.newAccount(password);
        const pwHash = web3?.utils.keccak256(password);
        const secretHash = web3?.utils.keccak256(secret);

        try {
          await contract.methods.newUser(
            address,
            username,
            fullName,
            pwHash,
            secretHash
          );

          const role = await contract.methods.getUser(address).call()[3];

          setUser({
            login: username,
            address,
            role,
          });

          navigate("/dashboard");
        } catch (e) {
          return alert("Such user already exists!");
        }
      });
  };

  return (
    <div className="signup-page">
      <div className="signup_page__form">
        <form onSubmit={handleSubmit}>
          <label>
            Полное имя:
            <input
              name="fullName"
              value={state.fullName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Логин:
            <input
              name="username"
              value={state.username}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Пароль:
            <input
              name="password"
              type="password"
              value={state.password}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Секрет:
            <input
              name="secret"
              type="password"
              value={state.secret}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
};
