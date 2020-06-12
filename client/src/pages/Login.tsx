import React, { useEffect, useState } from "react";
import { fetchJson, fetchText } from "./../utils";
import { TextInputField } from "./../components/Components";
import { Container, Grid, Typography, Button } from "@material-ui/core";
import { IdentityToken, emptyIdentityToken } from "./../interfaces";
import Logo from "./../img/Logo.png";
import "./../css/Login.css";

// Applease typescript
declare const window: any;
// Grab handle to our microapps js library
const microapps = window.microapps;

function Login() {
  const is_web = window.location == window.parent.location;
  const is_debug = true;
  const speed = 3;

  // Flag for us to manually run login on mobile
  const [loginError, setLoginError] = useState(false);
  // User Identity
  const [identity, setIdentity] = useState<IdentityToken>(emptyIdentityToken());

  const updateUser = (text: string) => {
    const newIdentity = emptyIdentityToken();
    newIdentity.sub = text;
    setIdentity(newIdentity);
  };

  const login = () => {
    console.log("Login type: " + (is_web ? "Web" : "Microapp"));
    if (is_web) {
      // Web 'faked' stuff
    } else {
      const request = { nonce: "Don't Hack me please" };
      microapps
        .getIdentity(request)
        .then((response: any) => {
          const decoded = JSON.parse(atob(response.split(".")[1]));
          setIdentity(decoded);
          console.log("getIdentity response: " + decoded);
        })
        .catch((error: any) => {
          console.error("An error occurred: " + error);
          setLoginError(true);
        });
    }
  };

  useEffect(() => {
    if (identity.sub != "EMPTY" && identity.sub != "") {
      alert(identity.sub);
      window.location.href = "/home";
    }
  }, [identity]);

  useEffect(() => {
    // Initial login if on microapp
    login();
  }, []);

  // Simple (Debugging) Login Form
  return (
    <Container disableGutters={true} className="Login">
      {/* Web Interface Testing purposes */}
      {is_web && (
        <Grid container spacing={3} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h3">$canAndG0</Typography>
          </Grid>
          <Grid item>
            <img src={Logo} height="200" width="auto" />
          </Grid>
          <Grid item>
            <TextInputField
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
              {" "}
              Log in{" "}
            </Button>
          </Grid>
        </Grid>
      )}
      {(!is_web || is_debug) && (
        <Grid container spacing={5} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h3">$canAndG0</Typography>
          </Grid>
          <Grid item>
            <img
              src={Logo}
              style={{ animation: `spin ${speed}s linear infinite` }}
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
                {" "}
                Log in{" "}
              </Button>
            </Grid>,
          ]}
        </Grid>
      )}
    </Container>
  );
}

export default Login;
