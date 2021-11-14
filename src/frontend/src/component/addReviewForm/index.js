import { useState } from "react";
import { useContext } from "../../hook/context";

export const AddReviewForm = (props) => {
  const { contract, user } = useContext();
  const { isAnswer, parent, shop } = props;
  const [values, setValues] = useState({
    content: "",
    rate: 0,
    parent: 0,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content, rate } = values;
    const { address } = user;

    await contract.methods
      .newReview(shop, content, rate, isAnswer ? parent : 0)
      .send({ from: address });
    props.onSubmit(event, values);
  };

  return (
    <div className={`add_${isAnswer ? "answer" : "review"}_form`}>
      <form onSubmit={handleSubmit}>
        <label>
          Content:
          <input
            name="content"
            type="text"
            value={values.content}
            onChange={handleChange}
          />
        </label>
        <br />
        {isAnswer ? null : (
          <>
            <label>
              Rating:
              <input
                name="rate"
                type="range"
                min="1"
                max="10"
                value={values.rate}
                onChange={handleChange}
              />
            </label>
            <br />
          </>
        )}
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
