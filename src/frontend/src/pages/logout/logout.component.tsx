import { useEffect } from "react";
import { useNavigate } from "react-router";
import { UseContext } from "../../hooks/storage";

export const Logout = () => {
  const { user, setUser } = UseContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.login) {
      setUser({});
    }
    navigate("/login");
  });

  return null;
};
