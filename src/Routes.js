import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CraDefaultApp from "./examples/cra-app/App";
import MuiDefaultApp from "./examples/mui/ExampleApp";
import MuiSignIn from "./examples/mui/SignIn";

export default function AppRoutes() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/mui-sign-in">Mui Sign In</Link>
          </li>
          <li>
            <Link to="/mui-default-app">Mui default</Link>
          </li>
          <li>
            <Link to="/">Cra default</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Routes>
        <Route element={<MuiSignIn />} path="/mui-sign-in" />
        <Route element={<MuiDefaultApp />} path="/mui-default-app" />
        <Route element={<CraDefaultApp />} path="/" />
      </Routes>
    </div>
  );
}
