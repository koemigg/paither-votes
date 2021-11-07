import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Vote from "./pages/Vote";
import Create from "./pages/Create";
// import Crypto from './pages/Crypto';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/Vote" component={Vote} />
      <Route exact path="/Create" component={Create} />
      {/* <Route exact path="/Crypto" component={Crypto} /> */}
      <Route exact path="/" component={Vote} />
    </Switch>
  </BrowserRouter>
);

export default Router;
