import { useEffect, useState } from "react";
import { Shop } from "../../component/shop";
import { useContext } from "../../hook/context";

export const Home = () => {
  const { contract } = useContext();
  const [shops, setShops] = useState([]);

  const getShops = async () => {
    const actualShops = await contract.methods.getShops().call();
    setShops(actualShops);
  };

  useEffect(() => {
    getShops();
  });

  return (
    <ol>
      {shops.map((shop, i) => (
        <Shop city={shop} key={i} />
      ))}
    </ol>
  );
};
