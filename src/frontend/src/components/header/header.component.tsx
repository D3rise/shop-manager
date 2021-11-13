import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "../../hooks/storage";
import { Clock } from "../clock/clock.component";
import { UserInfo } from "../userinfo/userinfo.component";

export function Header() {
  const { user } = useContext();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (user.login) {
      return setLoggedIn(true);
    }
    setLoggedIn(false);
  }, [user.login]);

  return (
    <>
      <h2>Shop Manager</h2>
      <UserInfo loggedIn={loggedIn} />
      <Clock />
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/shops">Shops</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
