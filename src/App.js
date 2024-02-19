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

export default function App({ children = <RouterProvider router={router} /> }) {
  // TODO: extract contexts to be injectable in storybook stories?
  return (
    <ErrorBoundary FallbackComponent={ResetAll} onReset={RESET}>
      {/* <React.Suspense fallback={<div>Loading...</div>}> */}
      <ThemeProvider theme={theme}>
        <TLIntlProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <GlobalLoader>
                <StackProvider
                  logAs="SnackbarProvider"
                  Ctx={SnackbarCtx}
                  ItemComponent={TLSnackbar}
                  mapExtraProps={mapSnackbarExtraProps}
                >
                  <I18nProvider>
                    <StackProvider
                      logAs="ModalProvider"
                      Ctx={ModalCtx}
                      ItemComponent={ConfirmModal}
                      mapExtraProps={mapModalExtraProps}
                    >
                      <ErrorBoundary
                        FallbackComponent={ResetAll}
                        onReset={RESET}
                      >
                        <RightMenuProvider>
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
