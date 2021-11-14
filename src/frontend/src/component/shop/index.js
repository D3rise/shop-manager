import { Fragment } from "react";
import { Link } from "react-router-dom";
import "./index.scss";

export const Shop = (props) => {
  const { city } = props;

  return (
    <Fragment>
      <li>
        <b>
          <Link to={`shop/${city}`}>{`${city} Shop`}</Link>
        </b>
      </li>
    </Fragment>
  );
};
