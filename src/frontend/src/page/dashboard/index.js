import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { SendElevateRequestForm } from "../../component/forms/requests";
import { AddShopForm, RemoveShopForm } from "../../component/forms/shop";
import { useContext } from "../../hook/context";
import { capitalizeString } from "../../utils";

export const Dashboard = () => {
  const { user, contract } = useContext();
  const navigate = useNavigate();

  const [availableOperations, setAvailableOperations] = useState([]);
  const [role, setRole] = useState();
  const [shops, setShops] = useState([]);

  const getRole = useCallback(async () => {
    const { role } = await contract.methods.getUser(user.address).call();
    setRole(role);
  }, [contract, setRole, user.address]);

  const getShops = useCallback(async () => {
    const actualShops = await contract.methods.getShops().call();
    setShops(actualShops);
  }, [contract.methods]);

  const getAvailableOperations = (role) => {
    let operations = [];
    switch (role) {
      case "0":
        operations = ["sendElevateRequests"];
        break;
      case "1":
        operations = ["viewHisShop", "sendElevateRequest"];
        break;
      case "2":
        break;
      case "3":
        operations = ["viewHisShop", "operateHisMoneyRequest"];
        break;
      case "4":
        operations = ["operateMoneyRequests"];
        break;
      case "5":
        operations = [
          "changeRoles",
          "viewElevateRequests",
          "addShop",
          "removeShop",
        ];
        break;
      default:
        break;
    }

    setAvailableOperations(operations);
  };

  useEffect(() => {
    if (!user.address) return navigate("/login");
    getRole().then(() => getAvailableOperations(role));
    getShops();
  }, [getRole, getShops, navigate, role, user.address]);

  const handleRemoveShop = (removed, city) => {
    if (removed)
      alert(`Successfully removed shop in ${capitalizeString(city)}!`);
  };

  const handleElevateRequestSend = (role, shop) => {
    alert(
      `You have successfully sent elevate request to role ${role}${
        role === "CASHIER" ? `and shop in ${shop} city` : ""
      }`
    );
  };

  return (
    <div className="dashboard_page">
      <ol>
        {availableOperations.includes("addShop") ? (
          <li key="add_shop">
            <AddShopForm />
          </li>
        ) : null}

        {availableOperations.includes("removeShop") ? (
          <li key="remove_shop">
            <RemoveShopForm onRemove={handleRemoveShop} />
          </li>
        ) : null}

        {availableOperations.includes("changeRoles") ? (
          <li key="change_roles">changeRoles</li>
        ) : null}

        {availableOperations.includes("viewElevateRequests") ? (
          <li key="view_elevate_requests">viewElevateRequests</li>
        ) : null}

        {availableOperations.includes("operateMoneyRequests") ? (
          <li key="operate_money_requests">operateMoneyRequests</li>
        ) : null}

        {availableOperations.includes("operateHisMoneyRequest") ? (
          <li key="operate_his_money_request">operateHisMoneyRequest</li>
        ) : null}

        {availableOperations.includes("viewHisShop") ? (
          <li key="view_his_shop">viewHisShop</li>
        ) : null}

        {availableOperations.includes("sendElevateRequests") ? (
          <li key="send_elevate_requests">
            <SendElevateRequestForm
              availableRoles={[role === "0" ? "CASHIER" : "BUYER"]}
              onSend={handleElevateRequestSend}
              shops={shops}
            />
          </li>
        ) : null}
      </ol>
    </div>
  );
};
