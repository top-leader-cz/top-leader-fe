import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import theme from "./theme";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </BrowserRouter>
  );
}
