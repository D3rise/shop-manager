import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AddReviewForm } from "../../component/addReviewForm";
import { useContext } from "../../hook/context";

export const Shop = () => {
  const [reviews, setReviews] = useState([]);
  const { city } = useParams();
  const { contract, user, setLoading } = useContext();

  const getAnswer = async (answer) => {
    return {
      sender: await contract.methods.getUser(answer.sender).call(),
      review: await contract.methods.getReview(answer).call(),
    };
  };

  const setActualReviews = async (review) => {
    const actualReview = await contract.methods.getReview(review).call();
    setReviews([
      ...reviews,
      {
        id: review,
        sender: await contract.methods.getUser(actualReview.sender).call(),
        review: actualReview,
        answers: actualReview.answers.map(getAnswer),
      },
    ]);
  };

  const getReviews = async () => {
    setLoading(true);
    const actualReviews = await contract.methods.getShopReviews(city).call();
    actualReviews.map(setActualReviews);
    setLoading(false);
  };

  const rateReview = async (review, positive) => {
    setLoading(true);
    if (
      review.review.likes.includes(user.address) ||
      review.review.dislikes.includes(user.address)
    ) {
      return alert("You already rated this review!");
    }
    await contract.methods
      .rateReview(review.id, positive)
      .send({ from: user.address });
    alert(`You ${positive ? "liked" : "disliked"} this comment!`);
    setLoading(false);
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
            {reviews.map((review) => (
              <li>
                <b>{review.sender.fullName}</b>
                <i> wrote:</i>
                <br />
                <blockquote>{review.review.content}</blockquote>
                <i>Rate: {review.review.rate}/10</i>
                {review.answers.length === 0 ? null : (
                  <h3>
                    Answers:{" "}
                    {review.answers.map((answer) => (
                      <>
                        <b>{answer.fullName}</b>;<i>wrote: </i>
                        <br />
                        <blockquote>{answer.answer.content}</blockquote>
                      </>
                    ))}
                  </h3>
                )}
                <br />
                <b>
                  Review rating:{" "}
                  {review.review.likes.length - review.review.dislikes.length}
                </b>
                <br />
                {user.address && (
                  <>
                    <button onClick={() => rateReview(review, true)}>
                      Like
                    </button>
                    <button onClick={() => rateReview(review, false)}>
                      Dislike
                    </button>
                  </>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
      <br />
      {user.address && <AddReviewForm shop={city} onSubmit={getReviews} />}
    </div>
  );
};
