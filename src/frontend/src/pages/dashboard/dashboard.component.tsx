import { useNavigate } from "react-router";
import { UseContext } from "../../hooks/storage";

export const Dashboard = () => {
  const { user } = UseContext();
  const navigate = useNavigate();

  if (!user.login) {
    navigate("/login");
  }

  return null;
};
