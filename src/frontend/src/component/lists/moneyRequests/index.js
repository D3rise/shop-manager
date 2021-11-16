import { useCallback, useEffect, useState } from "react";
import { useContext } from "../../../hook/context";

export const MoneyRequestsList = () => {
  const {
    contract,
    user: { address: from },
  } = useContext();
  const [requests, setRequests] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getRequests = useCallback(async () => {
    try {
      const { moneyRequesters } = await contract.methods
        .getMoneyRequests()
        .call({ from });

      moneyRequesters.map(async (requester) => {
        const request = await contract.methods
          .getMoneyRequest(requester)
          .call({ from });

        setRequests([...requests, { requester, request }]);
      });
    } catch (e) {
      console.log(e);
      alert(e);
    }
    console.log(requests);
  });

  useEffect(() => getRequests(), [getRequests]);

  return (
    <div className="money_requests_list">
      <ol>
        {requests.map((request, i) => (
          <>
            <li key={i}>
              <h4>{request.requester}</h4>
              <h5>
                Wanted sum of money: <b>{request.request.count}</b>
              </h5>
            </li>
            <br />
          </>
        ))}
      </ol>
    </div>
  );
};
