import React, { useContext, useEffect } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import { emptyUser } from "src/interfaces";
import { Redirect, RouteProps } from "react-router-dom";
import { LOGIN_PAGE } from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";

interface AuthenticatedRouteProps extends RouteProps {
  component: any;
}

/**
 * Route that wraps any component that requires user authentication,
 * and redirects the user to the Login page otherwise.
 */
const AuthenticatedRoute = (props: AuthenticatedRouteProps) => {
  const { component: Component, ...rest } = props;
  const { user } = useContext(AuthContext);
  const { setOpen, setAlertMessage, setAlertSeverity } = useContext(
    AlertContext
  );

  useEffect(() => {
    if (user === emptyUser) {
      setAlertMessage("Please login to access this page");
      setAlertSeverity("error");
      setOpen(true);
    }
  }, [user]);

  if (user === emptyUser) {
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

export default AuthenticatedRoute;
