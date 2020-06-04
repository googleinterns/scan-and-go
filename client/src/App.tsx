import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import ScanStore from "./pages/ScanStore";
import Receipt from "./pages/Receipt";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/store" component={ScanStore} />
        <Route path="/receipt" component={Receipt} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

export default App; // Exports the 'App' function as a React DOM component
