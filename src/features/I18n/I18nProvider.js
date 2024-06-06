import { Button } from "@mui/material";
import cs from "date-fns/locale/cs";
import de from "date-fns/locale/de";
import enGB from "date-fns/locale/en-GB";
import enUS from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { IntlProvider } from "react-intl";
import { useStaticCallback } from "../../hooks/useStaticCallback.hook";
import messages_cs from "../../translations/cs.json";
import messages_de from "../../translations/de.json";
import messages_en from "../../translations/en.json";
import messages_fr from "../../translations/fr.json";
import { useAuth, useMyMutation } from "../Authorization/AuthProvider"; // cyclic dependency when imported from Auth...../index
import { useI18nInternal } from "./useI18n.hook";
import { getBrowserTz } from "./utils/date";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { objOf } from "ramda";
import { useSnackbar } from "../Modal/ConfirmModal";
import { parametrizedRoutes } from "../../routes/constants";
import { SETTINGS_TABS } from "../Settings/Settings.page";
// import messages_de_en from "./translations/de_en.json";
// import messages_de_cz from "./translations/de_cz.json";
// import messages_es from "./translations/es.json";

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
export const locales = {
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
const isSupportedLanguage = (lang) => supportedLocales.includes(lang);

console.log(
  "%c[App init] COMMIT: " + process.env.REACT_APP_GIT_SHA,
  "color:deeppink",
  { supportedLocales, messages, locales }
);

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

export const I18nContext = createContext();

export const LocaleCtx = createContext();

// Needed in AuthProvider to translate errors, separated from I18nProvider which needs AuthProvider
export const TLIntlProvider = ({ children }) => {
  // let date = new Intl.DateTimeFormat(navigator.language).format(new Date());
  const browserLocale = Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.substring(0, 2);
  const browserLocaleFull = Intl.DateTimeFormat()
    .resolvedOptions()
    .locale.substring(0, 5);
  const savedLocale = window.sessionStorage.getItem("language");
  const defaultLocale = isSupportedLanguage(browserLocaleFull)
    ? browserLocaleFull
    : isSupportedLanguage(browserLocale)
    ? browserLocale
    : defaultLanguage;
  const [language, _setLanguage] = useState(
    isSupportedLanguage(savedLocale) ? savedLocale : defaultLocale
  );
  const setLanguage = useCallback((lang) => {
    if (!isSupportedLanguage(lang))
      return console.log("Unsupported locale: ", lang); //throw new Error("Unsupported lang");
    _setLanguage(lang);
    window.sessionStorage.setItem("language", lang);
  }, []);

  return (
    <LocaleCtx.Provider value={{ language, setLanguage, isSupportedLanguage }}>
      <IntlProvider
        locale={language}
        defaultLocale={defaultLanguage}
        messages={messages[language] || {}}
        // messages={{ exampleMessageId: "Example message" }}
      >
        {children}
      </IntlProvider>
    </LocaleCtx.Provider>
  );
};

function getDecimalSeparator(locale) {
  // Create a number formatter for the given locale
  const formatter = new Intl.NumberFormat(locale);

  // Use the formatter to format a number with a decimal part
  const parts = formatter.formatToParts(1.1);

  // Find and return the decimal separator
  const decimalPart = parts.find((part) => part.type === "decimal");
  return decimalPart ? decimalPart.value : null;
}

function guessExcelCsvDelimiter(locale) {
  // Create a number formatter for the given locale
  const formatter = new Intl.NumberFormat(locale);

  // Use the formatter to format a number with decimal and group parts
  const parts = formatter.formatToParts(1234.5);

  // Find the decimal separator
  const decimalPart = parts.find((part) => part.type === "decimal");
  const decimalSeparator = decimalPart ? decimalPart.value : ".";

  // Guess the delimiter based on the decimal separator
  const csvDelimiter = decimalSeparator === "," ? ";" : ",";

  return csvDelimiter;
}

export const I18nProvider = ({ children }) => {
  const { show } = useSnackbar();
  const { authFetch, userQuery, fetchUser } = useAuth();
  const { language, setLanguage } = useContext(LocaleCtx);
  const browserTz = getBrowserTz();
  const userTz = useMemo(
    () => userQuery.data?.timeZone || browserTz,
    [browserTz, userQuery.data?.timeZone]
  );
  const userTzMutation = useMyMutation({
    mutationFn: (timezone) =>
      authFetch({
        method: "POST",
        url: `/api/latest/user-info/timezone`,
        data: { timezone },
      }),
    onSuccess: () => fetchUser(),
  });
  const localeMutation = useMyMutation({
    fetchDef: {
      method: "POST",
      url: `/api/latest/user-info/locale`,
      from: objOf("locale"),
    },
    onSuccess: (data) => {
      console.log("[localeMutation.onSuccess]", { data });
      setLanguage(data.locale);
      fetchUser();
    },
  });
  useEffect(() => {
    if (userQuery.data?.locale && userQuery.data?.locale !== language) {
      setLanguage(userQuery.data.locale);
    }
  }, [language, setLanguage, userQuery.data?.locale]);

  const shouldSaveUserTz =
    userQuery.data &&
    !userQuery.data.timeZone &&
    browserTz &&
    !userTzMutation.isLoading;
  const saveUserTz = useStaticCallback(
    () => browserTz && userTzMutation.mutate(browserTz)
  );
  useEffect(() => {
    if (shouldSaveUserTz) {
      console.log( "%c[saveUserTz] initializing user tz (autosave)", "color:coral", { shouldSaveUserTz } ); // prettier-ignore
      saveUserTz();
    }
  }, [saveUserTz, shouldSaveUserTz]);
  const userTzWarningConfirmedRef = useRef(false);
  const userDataRef = useRef(userQuery.data);
  userDataRef.current = userQuery.data;
  const userTzWarning = Boolean(
    userQuery.data?.timeZone &&
      browserTz &&
      userQuery.data?.timeZone !== browserTz
  );
  useEffect(() => {
    // TODO: move Alert in Layout or inside IntlProvider, translate
    if (userTzWarning && !userTzWarningConfirmedRef.current) {
      userTzWarningConfirmedRef.current = true;
      console.log({ userTz: userDataRef.current?.timeZone, browserTz });
      show({
        type: "warning",
        variant: "filled",
        message: (
          <>
            Timezone on your machine ({browserTz}) seems different than in your
            profile ({userDataRef.current?.timeZone}). You can change it in
            <Button
              type="button"
              variant="text"
              href={parametrizedRoutes.settings({ tab: SETTINGS_TABS.GENERAL })}
            >
              General Settings
            </Button>
          </>
        ),
      });
      // alert(
      //   `Timezone on your machine (${browserTz}) seems different than in your profile (${userQuery.data?.timeZone}). You can change it in Menu -> Settings`
      // );
    }
  }, [userTzWarning]);

  const onReset = useCallback(
    ({ args }) => {
      setLanguage(args?.[0] || defaultLanguage);
    },
    [setLanguage]
  );
  const locale = locales[language];

  const i18n = useI18nInternal({
    userTz,
    language,
    locale,
  });
  // Not working on my machine, locale is en-GB (js + system), separator is ".", delimiter should be "," but excel uses ";" and it's not possible to change it in preferences
  // const decimalSeparator = getDecimalSeparator(locale.code);
  // const decimalSeparatorIsComma = decimalSeparator === ",";
  const guessedCsvDelimiter = guessExcelCsvDelimiter(locale.code);

  console.log("[I18nProvider.rndr]", {
    language,
    userTz,
    i18n,
    locale,
    guessedCsvDelimiter,
    // decimalSeparatorIsComma,
  });

  return (
    <ErrorBoundary fallbackRender={renderResetLang} onReset={onReset}>
      <I18nContext.Provider
        value={{
          language,
          setLanguage,
          localeMutation,
          userTz,
          userTzMutation,
          locale,
          i18n,
          guessedCsvDelimiter,
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          {children}
        </LocalizationProvider>
      </I18nContext.Provider>
    </ErrorBoundary>
  );
};
