import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./features/Authorization/AuthProvider";

// TODO: breaks app - circular dep?
// import { AuthProvider } from "./features/Auth";

import { router } from "./routes";
import theme from "./theme";
import "./index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { RightMenuProvider } from "./components/Layout";
import { IntlProvider } from "react-intl";
import messages_en from "./translations/en.json";
import messages_cs from "./translations/cs.json";
import messages_fr from "./translations/fr.json";
import messages_de_en from "./translations/de_en.json";
import messages_de_cz from "./translations/de_cz.json";
import messages_es from "./translations/es.json";
import { useState, createContext, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

const messages = {
  en: messages_en,
  cs: messages_cs,
  fr: messages_fr,
  de_en: messages_de_en,
  de_cz: messages_de_cz,
  es: messages_es,
};
const supportedLocales = Object.keys(messages);

export const TranslationContext = createContext();

const queryClient = new QueryClient();

function renderResetLang({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <Button variant="contained" onClick={() => resetErrorBoundary("en")}>
        Reset lang to English
      </Button>
    </div>
  );
}

const TranslationProvider = ({ children }) => {
  const browserLocale = Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.substring(0, 2);
  const savedLocale = window.sessionStorage.getItem("language");
  const defaultLocale = supportedLocales.includes(browserLocale)
    ? browserLocale
    : "en";
  const [language, _setLanguage] = useState(
    supportedLocales.includes(savedLocale) ? savedLocale : defaultLocale
  );
  const setLanguage = useCallback((lang) => {
    _setLanguage(lang);
    window.sessionStorage.setItem("language", lang);
  }, []);

  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [userTz, setUserTz] = useState(browserTz);

  const onReset = useCallback(
    ({ args }) => {
      console.log({ args });
      setLanguage(args?.[0] || "en");
    },
    [setLanguage]
  );

  return (
    <ErrorBoundary fallbackRender={renderResetLang} onReset={onReset}>
      <TranslationContext.Provider
        value={{ language, setLanguage, userTz, setUserTz }}
      >
        <IntlProvider
          // messages={{ exampleMessageId: "Example message" }}
          locale={language}
          defaultLocale="en"
          messages={messages[language] || {}}
        >
          {children}
        </IntlProvider>
      </TranslationContext.Provider>
    </ErrorBoundary>
  );
};

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <TranslationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ErrorBoundary FallbackComponent={ResetAll} onReset={RESET}>
                <GlobalLoader>
                  <RightMenuProvider>
                    <CssBaseline />
                    <RouterProvider router={router} />
                  </RightMenuProvider>
                </GlobalLoader>
              </ErrorBoundary>
            </LocalizationProvider>
          </TranslationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
