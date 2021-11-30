import { useEffect, useState } from "react";
import { Shop } from "../../component/lists/shop";
import { useContext } from "../../hook/context";

export const Home = () => {
  const { contract } = useContext();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    contract.methods
      .getShops()
      .call()
      .then((actualShops) => setShops(actualShops));
  });

  return (
    <ol>
      {shops.map((shop, i) => (
        <Shop city={shop} key={i} />
      ))}
    </ol>
  );
};
