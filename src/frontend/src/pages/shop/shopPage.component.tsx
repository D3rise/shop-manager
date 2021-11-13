import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useContext } from "../../hooks/storage";

export const ShopPage = () => {
  const { name } = useParams();
  const { contract } = useContext();
  const [state, setState] = useState<any>({ reviews: [] });

  useEffect(() => {
    contract.methods
      .getShopReviews(name)
      .call()
      .then(async (res: any) => {
        for (const i of res) {
          setState({
            reviews: [
              ...state.reviews,
              await contract.methods.getReview(i).call(),
            ],
          });
        }
      });
  });

  return (
    <div className="shop-page">
      <div className="shop_page--title">
        <h2>{`${name} Shop`}</h2>
      </div>
      <br />
      <div className="shop_page--reviews">
        {state.reviews.map((review: any) => {})}
      </div>
    </div>
  );
};
