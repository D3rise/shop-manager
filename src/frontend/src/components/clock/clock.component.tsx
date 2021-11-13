import React, { useEffect, useRef, useState } from "react";

export const Clock = () => {
  const [date, setDate] = useState(new Date());
  const timerID: any = useRef(null);

  useEffect(() => {
    timerID.current = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerID.current);
  });

  return (
    <h2 style={{ textAlign: "right" }}>
      {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}
    </h2>
  );
};
