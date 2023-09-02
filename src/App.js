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
import enGB from "date-fns/locale/en-GB";
import cs from "date-fns/locale/cs";
import { useMemo } from "react";

const messages = {
  en: messages_en,
  cs: messages_cs,
  fr: messages_fr,
  de_en: messages_de_en,
  de_cz: messages_de_cz,
  es: messages_es,
};
const locales = {
  en: enGB,
  cs: cs,
  // fr: enGB,
  // es: enGB,
};

if (Object.keys(messages).join() !== Object.keys(locales).join()) {
  console.error("messages and locales must match");
  // throw new Error("messages and locales must match")
}

const supportedLocales = Object.keys(messages);

console.log(
  "%c[App init] COMMIT: " + process.env.REACT_APP_GIT_SHA,
  "color:deeppink",
  { supportedLocales, messages, locales }
);

export const I18nContext = createContext();

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

const useI18n = ({ userTz, language }) => {
  const currentLocale = locales[language];
  if (!currentLocale) {
    throw new Error("Unsupported locale language: " + language);
  }
  const formats = useMemo(() => {
    return { dateShort: currentLocale.formatLong.date({ width: "short" }) };
  }, [currentLocale]);

  const format = useCallback(
    (date, formatStr = "PP") => {
      console.log("[useI18n.format] TODO: UTC", { date, formatStr });
      return format(date, formatStr, {
        locale: currentLocale,
      });
    },
    [currentLocale]
  );

  const i18n = useMemo(
    () => ({
      // TODO: https://date-fns.org/v2.29.3/docs/I18n
      uiFormats: { inputDateFormat: formats.dateShort },
      format,
    }),
    [format, formats]
  );
  return i18n;
};

const I18nProvider = ({ children }) => {
  // let date = new Intl.DateTimeFormat(navigator.language).format(new Date());
  const browserLocale = Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.substring(0, 2);
  const savedLocale = window.localStorage.getItem("language");
  const defaultLocale = supportedLocales.includes(browserLocale)
    ? browserLocale
    : "en";
  const [language, _setLanguage] = useState(
    supportedLocales.includes(savedLocale) ? savedLocale : defaultLocale
  );
  const setLanguage = useCallback((lang) => {
    _setLanguage(lang);
    window.localStorage.setItem("language", lang);
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

  const i18n = useI18n({ userTz, language });

  return (
    <ErrorBoundary fallbackRender={renderResetLang} onReset={onReset}>
      <I18nContext.Provider
        value={{ language, setLanguage, userTz, setUserTz, i18n }}
      >
        <IntlProvider
          locale={language}
          defaultLocale="en"
          messages={messages[language] || {}}
          // messages={{ exampleMessageId: "Example message" }}
        >
          {children}
        </IntlProvider>
      </I18nContext.Provider>
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
