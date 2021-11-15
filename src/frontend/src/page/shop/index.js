import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AddReviewForm } from "../../component/forms/addReview";
import { useContext } from "../../hook/context";
import "./index.scss";

export const Shop = () => {
  const [reviews, setReviews] = useState([]);
  const { city } = useParams();
  const { contract, user } = useContext();

  const getAnswer = async (answer) => {
    const actualAnswer = await contract.methods.getReview(answer).call();

    return {
      id: answer,
      sender: await contract.methods.getUser(actualAnswer.sender).call(),
      review: actualAnswer,
    };
  };

  const setActualReviews = async (review) => {
    console.log(review);
    const actualReview = await contract.methods.getReview(review).call();
    const sender = await contract.methods.getUser(actualReview.sender).call();
    const answers = await Promise.all(actualReview.answers.map(getAnswer));

    console.log(actualReview);
    return {
      id: review,
      sender,
      review: actualReview,
      answers,
      showAnswerForm: false,
    };
  };

  const getReviews = async () => {
    const actualReviews = await contract.methods.getShopReviews(city).call();
    setReviews(await Promise.all(actualReviews.map(setActualReviews)));
  };

  const onRateReview = async (review, positive) => {
    try {
      if (
        review.review.likes.includes(user.address) ||
        review.review.dislikes.includes(user.address)
      ) {
        return alert("You already rated this review!");
      }
      await contract.methods
        .rateReview(review.id, positive)
        .send({ from: user.address });
    } catch (e) {
      return alert(e.message.split(" ").slice(5).join(" "));
    }

    alert(`You ${positive ? "liked" : "disliked"} this comment!`);
    getReviews();
  };

  const onShowAnswerForm = (index) => {
    const newReviews = [...reviews];
    newReviews[index].showAnswerForm = true;
    setReviews(newReviews);
  };

  useEffect(() => {
    getReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`shop_${city}`}>
      <h2>{city} Shop</h2>
      <br />
      {reviews.length === 0 ? (
        <h3>No Reviews</h3>
      ) : (
        <>
          <h3>Reviews: </h3>
          <ol>
            {reviews.map((review, i) =>
              review.review.answer === "0" ? (
                <>
                  <li key={review.id}>
                    <b>{review.sender.fullName}</b>
                    <i> wrote:</i>
                    <br />
                    <blockquote>{review.review.content}</blockquote>
                    <i>Rate: {review.review.rate}/10</i>
                    {review.answers.length === 0 ? null : (
                      <>
                        <h5>Answers: </h5>
                        <ul>
                          {review.answers.map((answer) => (
                            <li>
                              <b>{answer.sender.fullName}</b> <i>wrote: </i>
                              <br />
                              <blockquote>{answer.review.content}</blockquote>
                              <b>
                                Review rating:{" "}
                                {answer.review.likes.length -
                                  answer.review.dislikes.length}
                              </b>
                              <br />
                              {user.address && (
                                <>
                                  <button
                                    onClick={() => onRateReview(answer, true)}
                                  >
                                    Like
                                  </button>
                                  <button
                                    onClick={() => onRateReview(answer, false)}
                                  >
                                    Dislike
                                  </button>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <br />
                    <b>
                      Review rating:{" "}
                      {review.review.likes.length -
                        review.review.dislikes.length}
                    </b>
                    <br />
                    {user.address && (
                      <>
                        <button onClick={() => onRateReview(review, true)}>
                          Like
                        </button>
                        <button onClick={() => onRateReview(review, false)}>
                          Dislike
                        </button>
                      </>
                    )}
                    <br />
                    {user.address ? (
                      review.showAnswerForm ? (
                        <AddReviewForm
                          isAnswer={true}
                          parent={review.id}
                          shop={city}
                          onSubmit={getReviews}
                        />
                      ) : (
                        <button onClick={() => onShowAnswerForm(i)}>
                          Answer
                        </button>
                      )
                    ) : null}
                  </li>
                </>
              ) : null
            )}
          </ol>
        </>
      )}
      <br />
      {user.address && <AddReviewForm shop={city} onSubmit={getReviews} />}
    </div>
  );
};
