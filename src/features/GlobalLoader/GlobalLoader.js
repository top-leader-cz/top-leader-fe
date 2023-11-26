import React, { useMemo, useState } from "react";
import { useAuth } from "../Authorization";
import { Backdrop, CircularProgress } from "@mui/material";

export const GlobalLoaderCtx = React.createContext({});

export const GlobalLoader = ({ children }) => {
  const auth = useAuth();
  const [
    globalLoaderWithChildrenDisplayed,
    setGlobalLoaderWithChildrenDisplayed,
  ] = useState(false);
  const ctx = useMemo(
    () => ({
      globalLoaderWithChildrenDisplayed,
      setGlobalLoaderWithChildrenDisplayed,
    }),
    [globalLoaderWithChildrenDisplayed]
  );

  if (!auth) debugger;

  const renderInner = () => {
    if (!auth) debugger;
    if (auth.isLoggedIn && !auth.user.data)
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    else if (globalLoaderWithChildrenDisplayed)
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    else return children;
  };

  return (
    <GlobalLoaderCtx.Provider value={ctx}>
      {renderInner()}
    </GlobalLoaderCtx.Provider>
  );
};
