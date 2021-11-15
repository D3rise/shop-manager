import { useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "../../../hook/context";
import { capitalizeString } from "../../../utils";
import { addShop, removeShop } from "../../../utils/shops";

export const AddShopForm = () => {
  const navigate = useNavigate();
  const { contract, web3 } = useContext();

  const [shopData, setShopData] = useState({
    city: "",
    password: "",
    secret: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setShopData({ ...shopData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { city, password, secret } = shopData;
    try {
      await addShop(web3, contract, city, password, secret);
      navigate(`/shop/${capitalizeString(city)}`);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div className="add_shop_form">
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input name="city" value={shopData.city} onChange={handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={shopData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Secret:
          <input
            name="secret"
            type="secret"
            value={shopData.secret}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export const RemoveShopForm = (props) => {
  const { user, contract } = useContext();
  const [city, setCity] = useState("");

  const handleChange = (event) => {
    const newCity = event.currentTarget.value;
    setCity(newCity);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await removeShop(contract, city, user.address);
      props.onRemove(true);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  return (
    <div className="remove_shop_form">
      <form onSubmit={handleSubmit}>
        <label>
          City:
          <input value={city} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Remove</button>
      </form>
    </div>
  );
};
