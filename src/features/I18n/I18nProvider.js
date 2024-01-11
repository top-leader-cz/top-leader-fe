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
import { useMutation } from "react-query";
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

export const I18nProvider = ({ children }) => {
  const { authFetch, user, fetchUser } = useAuth();
  const { language, setLanguage } = useContext(LocaleCtx);
  const browserTz = getBrowserTz();
  const userTz = useMemo(
    () => user.data?.timeZone || browserTz,
    [browserTz, user.data?.timeZone]
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
    if (user.data?.locale && user.data?.locale !== language) {
      setLanguage(user.data.locale);
    }
  }, [language, setLanguage, user.data?.locale]);

  const shouldSaveUserTz =
    user.data && !user.data.timeZone && browserTz && !userTzMutation.isLoading;
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
  const userDataRef = useRef(user.data);
  userDataRef.current = user.data;
  const userTzWarning = Boolean(
    user.data?.timeZone && browserTz && user.data?.timeZone !== browserTz
  );
  useEffect(() => {
    // TODO: move Alert in Layout or inside IntlProvider, translate
    if (userTzWarning && !userTzWarningConfirmedRef.current) {
      userTzWarningConfirmedRef.current = true;
      console.log({ userTz: userDataRef.current?.timeZone, browserTz });
      alert(
        `Timezone on your machine (${browserTz}) seems different than in your profile (${user.data?.timeZone}). You can change it in Menu -> Settings`
      );
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
  console.log("[I18nProvider.rndr]", { language, userTz, i18n });

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
