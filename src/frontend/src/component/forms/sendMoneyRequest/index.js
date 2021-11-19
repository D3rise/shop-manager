import { useState } from "react";
import { useContext } from "../../../hook/context";

export const SendMoneyRequestForm = () => {
  const {
    web3,
    user: { address: from },
    contract,
  } = useContext();
  const [count, setCount] = useState({ count: 0 });

  const handleChange = (event) => {
    const { value: newCount } = event.currentTarget;
    setCount(newCount);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await contract.methods
        .newMoneyRequest(web3.utils.toWei(count, "ether"))
        .send({ from });
      alert(
        "Successfully sent money request to bank! Required count of money: " +
          count
      );
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <div className="send_money_request_form">
      <form onSubmit={handleSubmit}>
        <label>
          Count:
          <br />
          <input
            type="number"
            name="count"
            value={count}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
