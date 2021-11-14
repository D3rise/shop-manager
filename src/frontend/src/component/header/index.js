import { Link } from "react-router-dom";
import "./index.scss";

export const Header = (props) => {
  const { loading, username } = props;

  return (
    <div className="header">
      <div className="header_title">
        <h1>
          <Link to="/">Shop Manager</Link>
        </h1>
      </div>
      <div className="header_username">
        {username ? (
          <>
            Welcome, <b>{username}</b>
          </>
        ) : (
          <Link to="/login">Log In</Link>
        )}{" "}
        | <Link to="/signup">Sign Up</Link>
      </div>

      <div className="header_navigator">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shops">Shops</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>

      {loading && (
        <>
          <div className="header_loading_indicator">
            <h5>Loading...</h5>
          </div>
        </>
      )}
    </div>
  );
};
