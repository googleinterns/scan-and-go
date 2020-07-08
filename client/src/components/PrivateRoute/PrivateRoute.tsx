import React, { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { emptyUser } from "src/interfaces";
import { Redirect, RouteProps } from "react-router-dom";
import { LOGIN_PAGE } from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";

interface PrivateRouteProps extends RouteProps {
  component: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  const { user } = useContext(AuthContext);
  const { setOpen, setAlertMessage, setAlertSeverity } = useContext(
    AlertContext
  );

  if (user === emptyUser) {
    setAlertMessage("Please login to access this page");
    setAlertSeverity("error");
    setOpen(true);
    return (
      <Redirect
        to={{
          pathname: LOGIN_PAGE,
          state: { from: rest.location },
        }}
      />
    );
  }
  return <Component {...props} />;
};

export default PrivateRoute;
