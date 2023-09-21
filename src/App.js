import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
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
import messages_de from "./translations/de.json";
// import messages_de_en from "./translations/de_en.json";
// import messages_de_cz from "./translations/de_cz.json";
// import messages_es from "./translations/es.json";
import { useState, createContext, useCallback } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import enGB from "date-fns/locale/en-GB";
import enUS from "date-fns/locale/en-US";
import cs from "date-fns/locale/cs";
import de from "date-fns/locale/de";
import fr from "date-fns/locale/fr";
import { useMemo } from "react";
import { formatWithOptions, startOfWeekWithOptions } from "date-fns/fp";
import * as dfnsfp from "date-fns/fp";
import { formatDistanceToNow, isValid, parse } from "date-fns";
import * as tz from "date-fns-tz";

window.dfnsfp = dfnsfp;

const messages = {
  en: messages_en,
  "en-US": messages_en,
  "en-GB": messages_en,
  cs: messages_cs,
  de: messages_de,
  fr: messages_fr,
  // de_en: messages_de_en,
  // de_cz: messages_de_cz,
  // es: messages_es,
};
const locales = {
  en: enGB, // TODO
  "en-GB": enGB,
  "en-US": enUS,
  cs: cs,
  de: de,
  fr: fr,
  // es: enGB,
};
export const defaultLanguage = "en";
/*
var locale = {
  code: 'cs',
  formatDistance: _index.default,
  formatLong: _index2.default,
  formatRelative: _index3.default,
  localize: _index4.default,
  match: _index5.default,
  options: {
    weekStartsOn: 1
    // Monday 
    ,
    firstWeekContainsDate: 4
  }
*/

if (
  Object.keys(messages).sort().join() !== Object.keys(locales).sort().join()
) {
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
      <Button
        variant="contained"
        onClick={() => resetErrorBoundary(defaultLanguage)}
      >
        Reset lang to English
      </Button>
    </div>
  );
}

export const UTC_DATE_FORMAT = "yyyy-MM-dd";
export const API_TIME_FORMAT = "HH:mm:ss";

const useI18n = ({ userTz, language }) => {
  const currentLocale = locales[language];
  if (!currentLocale) {
    throw new Error("Unsupported locale language: " + language);
  }
  // const formats = useMemo(() => {
  //   return { dateShort: currentLocale.formatLong.date({ width: "short" }) };
  // }, [currentLocale]);

  const formatLocal = useCallback(
    (date, formatStr = "PP") => {
      // console.log("[useI18n.formatLocal] TODO: UTC", { date, formatStr });
      return formatWithOptions(
        {
          locale: currentLocale,
        },
        formatStr,
        date
      );
    },
    [currentLocale]
  );

  const parseUTC = useCallback(
    (utcStr) => {
      // { zonedTimeToUtc, format }
      const date = new Date(utcStr.endsWith("Z") ? utcStr : utcStr + "Z");
      const zonedDate = tz.utcToZonedTime(date, userTz);

      return zonedDate;
    },
    [userTz]
  );

  const formatLocalMaybe = useCallback(
    (maybeDate, formatStr = "PP", defaultStr = "") => {
      const valid = isValid(maybeDate);

      console.log("formatLocalMaybe", {
        maybeDate,
        formatStr,
        defaultStr,
        valid,
      });

      return !valid ? defaultStr : formatLocal(maybeDate, formatStr);
    },
    [formatLocal]
  );

  const startOfWeek = useCallback(
    (...args) => {
      // console.log("[useI18n.startOfWeek] TODO: UTC", { args });
      return startOfWeekWithOptions(
        {
          locale: currentLocale,
        },
        ...args
      );
    },
    [currentLocale]
  );

  const parseDate = useCallback((input, referenceDate = new Date()) => {
    return parse(input, UTC_DATE_FORMAT, referenceDate);
  }, []);
  const _formatDistanceToNow = useCallback(
    (date, options = {}) => {
      return formatDistanceToNow(date, { ...options, locale: currentLocale });
    },
    [currentLocale]
  );

  const i18n = useMemo(
    () => ({
      // TODO: https://date-fns.org/v2.29.3/docs/I18n
      uiFormats: {
        inputDateFormat: currentLocale.formatLong.date({ width: "short" }),
        inputTimeFormat: currentLocale.formatLong.time({ width: "short" }),
        apiDateFormat: UTC_DATE_FORMAT,
        apiTimeFormat: API_TIME_FORMAT,
      },
      currentLocale,
      formatLocal,
      formatLocalMaybe,
      parseUTC,
      parseDate,
      startOfWeek,
      formatDistanceToNow: _formatDistanceToNow,
      weekStartsOn: currentLocale.options.weekStartsOn,
    }),
    [
      _formatDistanceToNow,
      currentLocale,
      formatLocal,
      formatLocalMaybe,
      parseUTC,
      parseDate,
      startOfWeek,
    ]
  );
  return i18n;
};

const I18nProvider = ({ children }) => {
  // let date = new Intl.DateTimeFormat(navigator.language).format(new Date());
  const browserLocale = Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.substring(0, 2);
  const browserLocaleFull = Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.substring(0, 5);
  const savedLocale = window.localStorage.getItem("language");
  const defaultLocale = supportedLocales.includes(browserLocaleFull)
    ? browserLocaleFull
    : supportedLocales.includes(browserLocale)
    ? browserLocale
    : defaultLanguage;
  const [language, _setLanguage] = useState(
    supportedLocales.includes(savedLocale) ? savedLocale : defaultLocale
  );
  const setLanguage = useCallback((lang) => {
    _setLanguage(lang);
    window.localStorage.setItem("language", lang);
  }, []);

  const { authFetch, user, fetchUser } = useAuth();

  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTz = useMemo(
    () => user.data?.timeZone || browserTz,
    [browserTz, user.data?.timeZone]
  );
  // const [userTz, setUserTz] = useState(browserTz);
  // useEffect(() => {
  //   if (user.data?.timeZone) setUserTz(user.data?.timeZone)
  // }, [user.data?.timeZone]);
  const userTzMutation = useMutation({
    mutationFn: (timezone) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-info/timezone`,
        data: { timezone },
      }),
    onSuccess: () => fetchUser(),
  });

  const onReset = useCallback(
    ({ args }) => {
      setLanguage(args?.[0] || defaultLanguage);
    },
    [setLanguage]
  );

  const i18n = useI18n({ userTz, language });

  return (
    <ErrorBoundary fallbackRender={renderResetLang} onReset={onReset}>
      <I18nContext.Provider
        value={{ language, setLanguage, userTz, userTzMutation, i18n }}
      >
        <IntlProvider
          locale={language}
          defaultLocale={defaultLanguage}
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
