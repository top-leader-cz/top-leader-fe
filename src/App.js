import { Button } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
// import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/Authorization/AuthProvider";
import { I18nProvider, TLIntlProvider } from "./features/I18n/I18nProvider";
import "./index.css";
// import { router } from "./routes";
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

export const Contexts = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ResetAll} onReset={RESET}>
      <ThemeProvider theme={theme}>
        <TLIntlProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <GlobalLoader>
                <StackProvider
                  logAs="SnackbarProvider"
                  Ctx={SnackbarCtx}
                  Provider={SnackbarCtx.Provider}
                  ItemComponent={TLSnackbar}
                >
                  <I18nProvider>
                    <StackProvider
                      logAs="ModalProvider"
                      Ctx={ModalCtx}
                      Provider={ModalCtx.Provider}
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
    </ErrorBoundary>
  );
};

// export default function App() {
//   return <RouterProvider router={router} />;
// }
