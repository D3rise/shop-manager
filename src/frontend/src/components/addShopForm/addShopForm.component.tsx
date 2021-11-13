import { FormEvent, useState } from "react";
import { useContext } from "../../hooks/storage";

export const AddShop = () => {
  const { user, contract, web3 } = useContext();

  const [state, setState] = useState<any>({
    shopName: "",
    shopPassword: "",
    shopSecret: "",
    success: false,
  });

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { name, pw, secret } = state;

    const existingAddress = await contract.methods
      .getUserAddress(name.toLowerCase())
      .call();
    if (await contract.methods.getUser(existingAddress).call()[0]) {
      return alert("You can't create shop with such name!");
    }

    const address = await web3?.eth.personal.newAccount(pw);
    const pwHash = web3?.utils.sha3(
      web3.eth.abi.encodeParameters(["string"], [pw])
    );
    const secretHash = web3?.utils.sha3(
      web3.eth.abi.encodeParameters(["string"], [secret])
    );

    await contract.methods
      .newUser(address, name.toLowerCase(), `${name} Shop`, pwHash, secretHash)
      .send({ from: address });
    await contract.methods.newShop(name, address).send({ from: address });

    setState({ ...state, success: true });
  };

  return (
    user.role === 5 && (
      <div className="add-shop-form">
        <form onSubmit={handleSubmit}>
          <label>
            Город магазина:
            <input
              name="shopName"
              value={state.shopName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Пароль магазина:
            <input
              name="shopPassword"
              value={state.shopPassword}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Секрет магазина:
            <input
              name="shopSecret"
              value={state.shopSecret}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit">Отправить</button>
        </form>
      </div>
    )
  );
};
