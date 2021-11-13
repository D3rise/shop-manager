import { FormEvent, useState } from "react";
import { useContext } from "../../hooks/storage";

interface IProps {
  shopName: string;
  answer?: number;
  onSuccess: any;
}

export const AddReviewForm = (props: IProps) => {
  const { user, contract } = useContext();
  const [state, setState] = useState({ rating: 0, content: "" });

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    if (user.role !== 0 && !props.answer)
      return alert(
        "You are not a buyer so you can't publish regular reviews, only answers"
      );

    try {
      await contract.methods
        .newReview(props.shopName, state.content, state.rating, props.answer)
        .send({ from: user.address });
    } catch (e: any) {
      return alert(e.message);
    }

    props.onSuccess(state);
  };

  return (
    <div className="add-review-form">
      <form onSubmit={handleSubmit}>
        <label>
          Отзыв:
          <input name="content" value={state.content} onChange={handleChange} />
        </label>
        <br />
        <label>
          Оценка:
          <input
            name="rating"
            type="range"
            min="1"
            max="10"
            value={state.rating}
            onChange={handleChange}
          />
        </label>
      </form>
      <br />
      <button type="submit">Отправить</button>
    </div>
  );
};
