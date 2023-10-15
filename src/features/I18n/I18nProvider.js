import { Button } from "@mui/material";
import cs from "date-fns/locale/cs";
import de from "date-fns/locale/de";
import enGB from "date-fns/locale/en-GB";
import enUS from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
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
import { useAuth } from "../Authorization/AuthProvider"; // cyclic dependency when imported from Auth...../index
import { useI18nInternal } from "./useI18n.hook";
import { getBrowserTz } from "./utils/date";
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

export const I18nProvider = ({ children }) => {
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
        value={{ language, setLanguage, userTz, userTzMutation, locale, i18n }}
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
