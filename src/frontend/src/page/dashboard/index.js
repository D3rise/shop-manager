import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { SendElevateRequestForm } from "../../component/forms/sendElevateRequest/elevate";
import { AddShopForm, RemoveShopForm } from "../../component/forms/shop";
import { useContext } from "../../hook/context";
import { capitalizeString } from "../../utils";
import { Shop } from "../../component/lists/shop";
import { MoneyRequestsList } from "../../component/lists/moneyRequests";
import { ChangeUserRoleForm } from "../../component/forms/changeUserRole";
import { ElevateRequestsList } from "../../component/lists/elevateRequests";
import { SendMoneyRequestForm } from "../../component/forms/sendMoneyRequest";

export const Dashboard = () => {
  const { user, contract } = useContext();
  const navigate = useNavigate();

  const [availableOperations, setAvailableOperations] = useState([]);
  const [role, setRole] = useState();
  const [shops, setShops] = useState([]);
  const [hisShop, setHisShop] = useState("");

  const getRoleAndShop = useCallback(async () => {
    const { role, shop } = await contract.methods.getUser(user.address).call();
    setRole(role);
    setHisShop(shop);
  }, [contract, setRole, setHisShop, user]);

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
        operations = ["viewHisShop", "sendElevateRequests"];
        break;
      case "2":
        break;
      case "3":
        operations = ["viewHisShop", "sendMoneyRequest"];
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
    getRoleAndShop().then(() => getAvailableOperations(role));
    getShops();
  }, [getRoleAndShop, getShops, navigate, role, user]);

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
            <h3>Add shop:</h3>
            <AddShopForm />
          </li>
        ) : null}

        {availableOperations.includes("removeShop") ? (
          <li key="remove_shop">
            <h3>Remove shop:</h3>
            <RemoveShopForm onRemove={handleRemoveShop} />
          </li>
        ) : null}

        {availableOperations.includes("changeRoles") ? (
          <li key="change_roles">
            <h3>Change user role:</h3>
            <ChangeUserRoleForm />
          </li>
        ) : null}

        {availableOperations.includes("viewElevateRequests") ? (
          <li key="view_elevate_requests">
            <h3>Current elevate requests:</h3>
            <ElevateRequestsList />
          </li>
        ) : null}

        {availableOperations.includes("operateMoneyRequests") ? (
          <li key="operate_money_requests">
            <h3>Current money requests:</h3>
            <MoneyRequestsList />
          </li>
        ) : null}

        {availableOperations.includes("sendMoneyRequest") ? (
          <li key="send_money_request">
            <h3>Send money request to bank:</h3>
            <SendMoneyRequestForm />
          </li>
        ) : null}

        {availableOperations.includes("viewHisShop") ? (
          <li key="view_his_shop">
            <h3>Your shop:</h3>
            <ul>
              <Shop city={hisShop} />
            </ul>
          </li>
        ) : null}

        {availableOperations.includes("sendElevateRequests") ? (
          <li key="send_elevate_requests">
            <h3>Send elevate request:</h3>
            <SendElevateRequestForm
              availableRoles={[role === "0" ? "CASHIER" : "BUYER", "ADMIN"]}
              onSend={handleElevateRequestSend}
              shops={shops}
            />
          </li>
        ) : null}
      </ol>
    </div>
  );
};
