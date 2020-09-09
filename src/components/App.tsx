import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { SWRConfig } from "swr";
import { Container } from "reactstrap";
import { NavBar } from "./NavBar";
import { Places } from "../pages/places/Places";
import { Things } from "../pages/things/Things";
import { fetcher } from "../utils/fetcher";
import { StateProviders } from "./StateProviders";

export const App = () => {
  return (
    <BrowserRouter>
      <SWRConfig value={{ fetcher }}>
        <StateProviders>
          <NavBar />
          <Container className="py-3">
            <Switch>
              <Redirect from="/" exact to="/places" />
              <Route path="/places">
                <Places />
              </Route>
              <Route path="/things">
                <Things />
              </Route>
              <Route>Not Found</Route>
            </Switch>
          </Container>
        </StateProviders>
      </SWRConfig>
    </BrowserRouter>
  );
};
