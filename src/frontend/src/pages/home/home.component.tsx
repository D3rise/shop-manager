import { useNavigate } from "react-router";
import { UseContext } from "../../hooks/storage";

export function Home() {
  const { user } = UseContext();
  const navigate = useNavigate();

  if (user.login) {
    navigate("/dashboard");
  }

  return (
    <>
      <h1>Hello world!</h1>
    </>
  );
}