import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import TextInputField from "src/components/TextInputField";
import { Grid, Typography, Button } from "@material-ui/core";
import { emptyUser, IdentityToken } from "src/interfaces";
import { HOME_PAGE, TITLE_TEXT } from "src/constants";
import { isWeb, isDebug } from "src/config";
import { loginUser } from "src/pages/Actions";
import { AuthContext } from "src/contexts/AuthContext";
import Logo from "src/img/Logo.png";
import "src/css/Login.css";
declare const window: any;

function Login() {
  const logoSpinnerSpeed = 3;

  const history = useHistory();

  // Flag for us to manually run login on mobile
  const [loginError, setLoginError] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  const login = () => {
    loginUser().then((decodedIdentity: IdentityToken | null) => {
      if (decodedIdentity) {
        setUser(
          Object.assign({}, emptyUser, {
            name: decodedIdentity.name,
            "user-id": decodedIdentity.sub,
          })
        );
      } else {
        setLoginError(true);
      }
    });
  };

  useEffect(() => {
    const { from } = history.location.state as any;
    if (user.name !== "EMPTY" && user.name !== "") {
      history.push({
        pathname: from ? from.pathname : HOME_PAGE,
        search: from ? from.search : "",
        state: {
          user: user,
          ...from.state,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    if (isWeb) {
      // Wait for gapi to be initialized stackoverflow.com/questions/31640234/using-google-sign-in-button-with-react-2
      window.addEventListener("google-loaded", renderGSigninButton);
    }
    // TODO (#163): synchronize login on microapp and web
    // Initial login if on microapp
    login();
  }, []);

  const onSignIn = async (googleUser: gapi.auth2.GoogleUser) => {
    // https://developers.google.com/identity/sign-in/web
    var profile = googleUser.getBasicProfile();
    setUser({
      name: profile.getName(),
      "user-id": profile.getId(),
    });
  };

  // Render Google Sign-in button in React component https://stackoverflow.com/a/59039972/
  const renderGSigninButton = () => {
    gapi.signin2.render("g-signin2", {
      scope: "https://www.googleapis.com/auth/plus.login",
      longtitle: true,
      theme: "dark",
      onsuccess: onSignIn,
    });
  };

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
            <TextInputField id="username" text="Username" fullWidth={true} />
          </Grid>
          <Grid item>
            <TextInputField type="password" text="Password" fullWidth={true} />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={login}>
              Log in
            </Button>
          </Grid>
          <div id="g-signin2" hidden={user !== emptyUser}></div>
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
