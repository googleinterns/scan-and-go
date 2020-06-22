import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "src/pages/Login";
import Home from "src/pages/Home";
import ScanStore from "src/pages/ScanStore";
import Receipt from "src/pages/Receipt";
import NotFound from "src/pages/NotFound";

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/home" component={Home} />
        <Route path="/store" component={ScanStore} />
        <Route path="/receipt" component={Receipt} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

export default App; // Exports the 'App' function as a React DOM component
