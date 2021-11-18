import { useState } from "react";
import { useContext } from "../../../hook/context";

export const AddReviewForm = (props) => {
  const { contract, user } = useContext();
  const { parent, shop } = props;
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

    try {
      await contract.methods
        .newReview(shop, content, parent ? 1 : rate, parent ? parent : 0)
        .send({ from: address });
      props.onSubmit(event, values);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <div className={`add_${parent ? "answer" : "review"}_form`}>
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
        {parent ? null : (
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
