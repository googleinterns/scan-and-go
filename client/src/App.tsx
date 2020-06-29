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
import { ThemeProvider } from "@material-ui/core/styles";

function App() {
  return (
    <main>
      <ThemeProvider theme={AppTheme}>
        <Container disableGutters={!isWeb}>
          <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/home" component={Home} />
            <Route path="/store" component={ScanStore} />
            <Route path="/receipt" component={Receipt} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </ThemeProvider>
    </main>
  );
}

export default App; // Exports the 'App' function as a React DOM component
