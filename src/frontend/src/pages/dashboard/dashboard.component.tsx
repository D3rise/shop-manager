import { useNavigate } from "react-router";
import { useContext } from "../../hooks/storage";

export const Dashboard = () => {
  const { user } = useContext();
  const navigate = useNavigate();

  if (!user.login) {
    navigate("/login");
  }

  return null;
};
