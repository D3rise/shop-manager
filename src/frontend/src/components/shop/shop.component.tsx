import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UseContext } from "../../hooks/storage";

export interface IShop {
  shopCity?: string;
  shopOwner?: string;
}

export const Shop = (props: IShop) => {
  const { contract } = UseContext();
  const [shop, setShop] = useState([]);

  const getShop = async () => {
    if (props.shopCity) {
      setShop(await contract.methods.getShopByCity(props.shopCity).call());
    } else {
      setShop(await contract.methods.getShopByOwner(props.shopOwner).call());
    }
  };

  useEffect(() => {
    getShop();
  });

  if (!shop[0]) {
    return null;
  }

  return (
    <div className={`shop__${shop[1]}`}>
      <Link to={`/shop/${shop[1]}`}>
        <b>{shop[1]}</b>
      </Link>
    </div>
  );
};
