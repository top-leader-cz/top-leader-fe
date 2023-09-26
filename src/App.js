import { Backdrop, Button, CircularProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/Authorization/AuthProvider";
import { I18nProvider } from "./features/I18n/I18nProvider";
import { router } from "./routes";
import theme from "./theme";
import "./index.css";

import { RightMenuProvider } from "./components/Layout"; // circular dependency when imported earlier

const queryClient = new QueryClient();

const GlobalLoader = ({ children }) => {
  const auth = useAuth();
  if (auth.isLoggedIn && !auth.user.data)
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

export default function App() {
  console.log("App rndr");
  return (
    <ErrorBoundary FallbackComponent={ResetAll} onReset={RESET}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GlobalLoader>
            <ThemeProvider theme={theme}>
              <I18nProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <ErrorBoundary FallbackComponent={ResetAll} onReset={RESET}>
                    <RightMenuProvider>
                      <CssBaseline />
                      <RouterProvider router={router} />
                    </RightMenuProvider>
                  </ErrorBoundary>
                </LocalizationProvider>
              </I18nProvider>
            </ThemeProvider>
          </GlobalLoader>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
