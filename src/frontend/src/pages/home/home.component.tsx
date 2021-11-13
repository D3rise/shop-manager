import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useContext } from "../../hooks/storage";

export function Home() {
  const { user } = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.login) {
      navigate("/dashboard");
    }
  });

  return (
    <>
      <h1>Hello world!</h1>
    </>
  );
}
