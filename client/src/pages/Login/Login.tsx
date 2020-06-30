import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TextInputField from "src/components/TextInputField";
import { Grid, Typography, Button } from "@material-ui/core";
import { User, emptyUser, IdentityToken } from "src/interfaces";
import { HOME_PAGE, TITLE_TEXT } from "src/constants";
import { isWeb, isDebug } from "src/config";
import { loginUser } from "src/pages/Actions";
import Logo from "src/img/Logo.png";
import "src/css/Login.css";
declare const window: any;

function Login() {
  const logoSpinnerSpeed = 3;

  const history = useHistory();

  // Flag for us to manually run login on mobile
  const [loginError, setLoginError] = useState(false);
  const [user, setUser] = useState<User>(emptyUser());

  const updateUser = (text: string) => {
    //setIdentity(Object.assign({}, emptyIdentityToken(), { sub: text }));
    setUser(
      Object.assign({}, emptyUser(), {
        name: text,
        "user-id": "TEST_WEB_USER",
      })
    );
  };

  const login = () => {
    const decodedIdentity: IdentityToken | null = loginUser();
    if (decodedIdentity) {
      setUser(
        Object.assign({}, emptyUser(), {
          name: decodedIdentity.name,
          "user-id": decodedIdentity.sub,
        })
      );
    } else {
      setLoginError(true);
    }
  };

  useEffect(() => {
    if (user.name !== "EMPTY" && user.name !== "") {
      history.push({
        pathname: HOME_PAGE,
        state: {
          user: user,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    // Initial login if on microapp
    login();
  }, []);

  // Simple (Debugging) Login Form
  return (
    <div className="Login">
      {/* Web Interface Testing purposes */}
      {isWeb && (
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h3">{TITLE_TEXT}</Typography>
          </Grid>
          <Grid item>
            <img src={Logo} height="200" width="auto" />
          </Grid>
          <Grid item>
            <TextInputField
              id="username"
              text="Username"
              fullWidth={true}
              setState={updateUser}
            />
          </Grid>
          <Grid item>
            <TextInputField type="password" text="Password" fullWidth={true} />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={login}>
              Log in
            </Button>
          </Grid>
        </Grid>
      )}
      {(!isWeb || isDebug) && (
        <Grid container spacing={5} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h3">{TITLE_TEXT}</Typography>
          </Grid>
          <Grid item>
            <img
              src={Logo}
              style={{ animation: `spin ${logoSpinnerSpeed}s linear infinite` }}
              height="200"
              width="auto"
            />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Please wait while we log in using your Google account associated
              with GPay.
            </Typography>
          </Grid>
          {loginError && [
            <Grid item>
              <Typography variant="body1">
                Something has gone wrong, please use the button below to login!
              </Typography>
            </Grid>,
            <Grid item>
              <Button variant="contained" color="secondary" onClick={login}>
                Log in
              </Button>
            </Grid>,
          ]}
        </Grid>
      )}
    </div>
  );
}

export default Login;
