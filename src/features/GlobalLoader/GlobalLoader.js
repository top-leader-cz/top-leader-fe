import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { gray200 } from "../../theme";
import { useAuth } from "../Authorization";

export const GlobalLoader = ({ children }) => {
  const auth = useAuth();

  if (!auth) {
    console.log("Missing auth");
    debugger;
  }

  if (auth?.isLoggedIn && !auth?.user.data)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress sx={{ color: gray200, opacity: 0.5 }} />
      </Backdrop>
    );
  else return children;
};
