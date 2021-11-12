import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseContext } from "../../hooks/storage";

interface IState {
  username: string;
  password: string;
  secret: string;
  [x: string]: any;
}

export const Login = () => {
  const navigate = useNavigate();
  const { web3, contract, user, setUser } = UseContext();

  useEffect(() => {
    if (user.login) {
      navigate("/dashboard");
    }
  });

  const [state, setState] = useState<IState>({
    username: "",
    password: "",
    secret: "",
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { username, password, secret } = state;
    const address = await contract.methods.getUserAddress(username).call();

    if (user.login) {
      navigate("/");
    }

    try {
      await web3!.eth.personal.unlockAccount(address, password, 0);

      await contract.methods
        .authenticateUser(
          username,
          web3?.utils.sha3(password),
          web3?.utils.sha3(secret)
        )
        .call();
    } catch (e) {
      return alert("Wrong login, password or secret!");
    }

    const role = await contract.getUser(address).call()[3];

    setUser({
      login: username,
      address,
      role,
    });
    alert("success");
    navigate("/");
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <div className="login-page">
      <div className="login_page__form">
        <form onSubmit={handleSubmit}>
          <label>
            Имя:
            <input
              name="username"
              value={state.username}
              onChange={handleChange}
            ></input>
          </label>
          <br />
          <label>
            Пароль:
            <input
              name="password"
              value={state.password}
              type="password"
              onChange={handleChange}
            ></input>
          </label>
          <br />
          <label>
            Секрет:
            <input
              name="secret"
              value={state.secret}
              type="password"
              onChange={handleChange}
            ></input>
          </label>
          <br />
          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  );
};
