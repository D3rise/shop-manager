interface IProps {
  author: string;
  rating: number;
  content: string;
}

export const Review = (props: IProps) => {
  return (
    <li>
      <h3>Автор: {props.author}</h3>
      <br />
      <h4>{props.content}</h4>
      <b>
        Оценка: <i>{props.rating}</i>
      </b>
    </li>
  );
};
