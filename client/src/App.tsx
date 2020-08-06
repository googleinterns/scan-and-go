import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "src/pages/Login";
import Home from "src/pages/Home";
import ScanStore from "src/pages/ScanStore";
import Receipt from "src/pages/Receipt";
import NotFound from "src/pages/NotFound";
import AppTheme from "src/theme";
import { isWeb } from "src/config";
import { Container } from "@material-ui/core";
import AlertSnackbar from "./components/AlertSnackbar";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import { AuthContextProvider } from "src/contexts/AuthContext";
import { AlertContextProvider } from "./contexts/AlertContext";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import "src/css/App.css";
import {
  LOGIN_PAGE,
  SCANSTORE_PAGE,
  HOME_PAGE,
  RECEIPT_PAGE,
} from "./constants";

function App() {
  const theme = useTheme();
  // Add spacing around page borders if in microapp environment
  const microappStyling = isWeb
    ? undefined
    : {
        padding: theme.spacing(1),
      };
  return (
    <main>
      <ThemeProvider theme={AppTheme}>
        <AuthContextProvider>
          <AlertContextProvider>
            <Container
              className="AppContainer"
              disableGutters={!isWeb}
              style={microappStyling}
            >
              <Switch>
                <Route path={HOME_PAGE} component={Home} />
                <Route path={LOGIN_PAGE} component={Login} exact />
                <Route path={SCANSTORE_PAGE} component={ScanStore} />
                <AuthenticatedRoute path={RECEIPT_PAGE} component={Receipt} />
                <Route component={NotFound} />
              </Switch>
              <AlertSnackbar />
            </Container>
          </AlertContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </main>
  );
}

export default App;
