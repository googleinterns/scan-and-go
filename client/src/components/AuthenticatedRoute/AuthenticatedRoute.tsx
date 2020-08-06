import React, { useContext, useEffect } from "react";
import { AuthContext } from "src/contexts/AuthContext";
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
  const { setAlert } = useContext(AlertContext);

  if (!user["user-id"]) {
    setAlert("error", "Please login to access this page");
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
