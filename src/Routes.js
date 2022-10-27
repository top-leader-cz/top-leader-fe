import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CraDefaultApp from "./examples/cra-app/App";
import MuiDefaultApp from "./examples/mui/ExampleApp";
import MuiSignIn from "./components/SignIn";

export const routes = {
  signIn: "/mui-sign-in",
  dashboard: "/dashboard",
  muiDefaultApp: "/mui-default-app",
  craDefaultApp: "/",
};

export default function AppRoutes() {
  /* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */
  return (
    <Routes>
      <Route element={<MuiSignIn />} path={routes.signIn} />
      <Route element={<Dashboard />} path={routes.dashboard} />
      <Route element={<MuiDefaultApp />} path={routes.muiDefaultApp} />
      <Route element={<CraDefaultApp />} path={routes.craDefaultApp} />
    </Routes>
  );
}
