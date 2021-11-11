import { Link } from "react-router-dom";
import { Clock } from "../clock/clock.component";

export function Header() {
  return (
    <>
      <Clock />
      <h2>Shop Manager</h2>
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
        </ul>
      </nav>
    </>
  );
}
