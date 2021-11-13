import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useContext } from "../../hooks/storage";

export const Logout = () => {
  const { user, setUser } = useContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.login) {
      setUser({});
    }
    navigate("/login");
  });

  return null;
};
