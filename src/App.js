import { Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/Authorization/AuthProvider";
import { I18nProvider, TLIntlProvider } from "./features/I18n/I18nProvider";
import "./index.css";
import { router } from "./routes";
import theme from "./theme";

import { RightMenuProvider } from "./components/Layout"; // circular dependency when imported earlier
import { GlobalLoader } from "./features/GlobalLoader/GlobalLoader";
import {
  ConfirmModal,
  ModalCtx,
  SnackbarCtx,
  StackProvider,
  TLSnackbar,
  mapModalExtraProps,
  mapSnackbarExtraProps,
} from "./features/Modal/ConfirmModal";

const queryClient = new QueryClient();

if (process.env.NODE_ENV !== "production") window.queryClient = queryClient;

const RESET = () => {
  sessionStorage.clear();
  localStorage.clear();
  queryClient.removeQueries();
  window.location.reload();
};

function ResetAll({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <Button variant="contained" onClick={() => resetErrorBoundary()}>
        Reset
      </Button>
    </div>
  );
}

export const DetectUnmount = ({ logLabel = "DetectUnmount" }) => {
  const mountColor = "lightgreen";
  const unmountColor = "pink";
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.log(`%c[${logLabel}] mounting`, `color:${mountColor};`);
    return () => {
      if (process.env.NODE_ENV === "development")
        console.log(`%c[${logLabel}] unmounting`, `color:${unmountColor};`);
      // debugger;
    };
  }, []);
  return null;
};

export default function App({ children = <RouterProvider router={router} /> }) {
  // TODO: extract contexts to be injectable in storybook stories?
  return (
    <ErrorBoundary FallbackComponent={ResetAll} onReset={RESET}>
      <DetectUnmount logLabel="1" />
      {/* <React.Suspense fallback={<div>Loading...</div>}> */}
      <ThemeProvider theme={theme}>
        <DetectUnmount logLabel="2" />
        <TLIntlProvider>
          <DetectUnmount logLabel="3" />
          <QueryClientProvider client={queryClient}>
            <DetectUnmount logLabel="4" />
            <AuthProvider>
              <DetectUnmount logLabel="5" />
              <GlobalLoader>
                <DetectUnmount logLabel="6" />
                <StackProvider
                  logAs="SnackbarProvider"
                  Ctx={SnackbarCtx}
                  ItemComponent={TLSnackbar}
                  mapExtraProps={mapSnackbarExtraProps}
                >
                  <DetectUnmount logLabel="7" />
                  <I18nProvider>
                    <DetectUnmount logLabel="8" />
                    <StackProvider
                      logAs="ModalProvider"
                      Ctx={ModalCtx}
                      ItemComponent={ConfirmModal}
                      mapExtraProps={mapModalExtraProps}
                    >
                      <DetectUnmount logLabel="9" />
                      <ErrorBoundary
                        FallbackComponent={ResetAll}
                        onReset={RESET}
                      >
                        <DetectUnmount logLabel="10" />
                        <RightMenuProvider>
                          <DetectUnmount logLabel="11" />
                          <CssBaseline />
                          {children}
                        </RightMenuProvider>
                      </ErrorBoundary>
                    </StackProvider>
                  </I18nProvider>
                </StackProvider>
              </GlobalLoader>
            </AuthProvider>
          </QueryClientProvider>
        </TLIntlProvider>
      </ThemeProvider>
      {/* </React.Suspense> */}
    </ErrorBoundary>
  );
}
