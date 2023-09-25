import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useRef } from "react";
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
import {
  API_TIME_FORMAT,
  UTC_DATE_FORMAT,
  formatISOZoned,
  parseUTCZoned,
} from "./utils/date";

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

export const useStaticCallback = (callback) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback((...args) => callbackRef.current(...args), []);
};

const useI18n = ({ userTz, language }) => {
  const currentLocale = locales[language];
  if (!currentLocale) {
    throw new Error("Unsupported locale language: " + language);
  }

  const parseDate = useCallback((input, referenceDate = new Date()) => {
    return parse(input, UTC_DATE_FORMAT, referenceDate);
  }, []);

  const parseUTCLocal = useCallback(
    (utcStr) => {
      return parseUTCZoned(userTz, utcStr);
    },
    [userTz]
  );

  const formatLocal = useCallback(
    (date, formatStr = "PP") => {
      // console.log("[useI18n.formatLocal] TODO: UTC", { date, formatStr });
      try {
        return formatWithOptions(
          {
            locale: currentLocale,
            // timeZone? https://stackoverflow.com/questions/58561169/date-fns-how-do-i-format-to-utc
          },
          formatStr,
          date
        );
      } catch (e) {
        console.error("[formatLocal]", { e, date, formatStr, currentLocale });
        return "";
      }
    },
    [currentLocale]
  );

  const zonedToUtcLocal = useCallback(
    (localDate) => {
      console.log({ userTz });
      return tz.zonedTimeToUtc(localDate, userTz);
    },
    [userTz]
  );

  const formatUtcLocal = useCallback(
    (localDate) => {
      // TODO: to utc?
      const str = formatLocal(localDate, UTC_DATE_FORMAT);

      console.log("[formatUtcLocal]", { userTz, localDate, str });

      return str;
    },
    [formatLocal, userTz]
  );

  const formatLocalMaybe = useCallback(
    (maybeDate, formatStr = "PP", defaultStr = "") => {
      const valid = isValid(maybeDate);
      // console.log("formatLocalMaybe", { maybeDate, formatStr, defaultStr, valid, });
      return !valid ? defaultStr : formatLocal(maybeDate, formatStr);
    },
    [formatLocal]
  );

  const startOfWeekLocal = useCallback(
    (date) => {
      // console.log("[useI18n.startOfWeekLocal] TODO: UTC", { args });
      return startOfWeekWithOptions(
        {
          locale: currentLocale,
        },
        date
      );
    },
    [currentLocale]
  );

  const formatDistanceToNowLocal = useCallback(
    (date, options = {}) => {
      return formatDistanceToNow(date, { ...options, locale: currentLocale });
    },
    [currentLocale]
  );

  const i18n = useMemo(
    () => ({
      // TODO: https://date-fns.org/v2.29.3/docs/I18n
      currentLocale,
      uiFormats: {
        inputDateFormat: currentLocale.formatLong.date({ width: "short" }),
        inputTimeFormat: currentLocale.formatLong.time({ width: "short" }),
        apiDateFormat: UTC_DATE_FORMAT,
        apiTimeFormat: API_TIME_FORMAT,
      },
      formatLocal,
      formatLocalMaybe,
      formatUtcLocal,
      parseUTCLocal,
      parseDate,
      formatDistanceToNow: formatDistanceToNowLocal,
      zonedToUtcLocal,
      weekStartsOn: currentLocale.options.weekStartsOn,
      startOfWeekLocal,
      getFirstDayOfTheWeekLocal: (date = new Date()) =>
        i18n.formatLocal(
          startOfWeekLocal(date), // TODO: Dan
          UTC_DATE_FORMAT
        ),
    }),
    [
      currentLocale,
      formatLocal,
      formatLocalMaybe,
      parseUTCLocal,
      formatUtcLocal,
      zonedToUtcLocal,
      parseDate,
      formatDistanceToNowLocal,
      startOfWeekLocal,
    ]
  );
  return i18n;
};

export const getBrowserTz = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

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

  const browserTz = getBrowserTz();
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

  const shouldSaveUserTz =
    user.data && !user.data.timeZone && browserTz && !userTzMutation.isLoading;
  const saveUserTz = useStaticCallback(
    () => browserTz && userTzMutation.mutate(browserTz)
  );
  useEffect(() => {
    if (shouldSaveUserTz) {
      console.log(
        "%c[saveUserTz] initializing user tz (autosave)",
        "color:coral",
        { shouldSaveUserTz }
      );
      saveUserTz();
    }
  }, [saveUserTz, shouldSaveUserTz]);
  const userTzWarning = Boolean(
    user.data?.timeZone && browserTz && user.data?.timeZone !== browserTz
  );
  useEffect(() => {
    // TODO: move Alert in Layout or inside IntlProvider, translate
    if (userTzWarning)
      alert(
        "Timezone on your machine seems different than in your profile. You can change it in Menu -> Settings"
      );
  }, [userTzWarning]);

  const onReset = useCallback(
    ({ args }) => {
      setLanguage(args?.[0] || defaultLanguage);
    },
    [setLanguage]
  );

  const i18n = useI18n({ userTz, language });
  console.log("[I18nProvider.rndr]", { language, userTz, i18n });

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
