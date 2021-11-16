import { useCallback, useState, useEffect } from "react";
import { useContext } from "../../../hook/context";
import { Roles } from "../../../utils/roles";

export const ElevateRequestsList = () => {
  const {
    contract,
    user: { address: from },
  } = useContext();
  const [requests, setRequests] = useState([]);

  const handleRequestOperation = async (requester, accept) => {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRequests = useCallback(async () => {
    const actualRequests = await contract.methods
      .getElevateRequests()
      .call({ from });

    actualRequests.map(async (requester) => {
      const request = await contract.methods
        .getElevateRequest(requester)
        .call({ from });

      const sender = await contract.methods.getUser(requester).call();
      const role = Roles[request.requiredRole];
      const { shop } = request;

      setRequests(() => [...requests, { from: requester, sender, role, shop }]);
    });
  });

  useEffect(() => getRequests(), [getRequests]);

  return (
    <>
      <div className="elevate_requests_list">
        <ol>
          {requests.map((request, i) => (
            <>
              <li key={i}>
                <h4>Request from: {request.sender.username}</h4>
                <h5>
                  Role: <b>{request.role}</b>
                </h5>
                {request.role === "CASHIER" && <h5>Shop: {request.shop}</h5>}
                <button
                  onClick={() => handleRequestOperation(request.from, true)}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequestOperation(request.from, false)}
                >
                  Deny
                </button>
              </li>
            </>
          ))}
        </ol>
      </div>
    </>
  );
};
