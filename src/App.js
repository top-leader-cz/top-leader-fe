import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/Auth/AuthProvider";

// TODO: breaks app - circular dep?
// import { AuthProvider } from "./features/Auth";

import { router } from "./routes";
import theme from "./theme";
import "./index.css";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
