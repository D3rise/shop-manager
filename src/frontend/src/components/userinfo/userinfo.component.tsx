import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UseContext } from "../../hooks/storage";

interface IProps {
  loggedIn: boolean;
}

export const UserInfo = (props: IProps) => {
  const { user } = UseContext();
  const [userInfo, setUserInfo] = useState({ login: null });

  useEffect(() => {
    if (props.loggedIn) {
      setUserInfo({ login: user.login });
    }
  }, [user.login, props.loggedIn]);

  return (
    <div className="userinfo" style={{ textAlign: "right" }}>
      <div className="userinfo__login">
        {props.loggedIn ? (
          <>
            Текущий пользователь: <b>{userInfo.login}</b>
          </>
        ) : (
          <Link to="/login">
            <b>Войти</b>
          </Link>
        )}
      </div>
    </div>
  );
};
