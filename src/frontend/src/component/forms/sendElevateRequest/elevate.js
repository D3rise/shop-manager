import { useContext } from "../../../hook/context";
import { useState } from "react";
import { Roles } from "../../../utils/roles";
import { capitalizeString, getKeyByValue } from "../../../utils";

export const SendElevateRequestForm = (props) => {
  const { shops, availableRoles, onSend } = props;
  const { contract, user } = useContext();

  const [requestDetails, setRequestDetails] = useState({
    shop: shops[0],
    role: availableRoles[0],
  });

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;
    setRequestDetails({ ...requestDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { role, shop } = requestDetails;

    const roleToRequest = getKeyByValue(Roles, role);
    console.log(roleToRequest);

    try {
      await contract.methods
        .newElevateRequest(roleToRequest, roleToRequest === "1" ? shop : "")
        .send({ from: user.address });
      onSend(role, shop);
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <div className="send_elevate_request_form">
      <form onSubmit={handleSubmit}>
        <label>
          Role:
          <select
            name="role"
            value={requestDetails.role}
            onChange={handleChange}
          >
            {Roles.map(
              (role) =>
                availableRoles.includes(role) && (
                  <option value={role}>{role}</option>
                )
            )}
          </select>
        </label>
        <br />
        {requestDetails.role === "CASHIER" && (
          <>
            <label>
              Shop:
              <select
                name="shop"
                value={requestDetails.shop}
                onChange={handleChange}
              >
                {shops.map((shop) => (
                  <>
                    <option value={shop}>{capitalizeString(shop)}</option>
                  </>
                ))}
              </select>
            </label>
          </>
        )}
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
