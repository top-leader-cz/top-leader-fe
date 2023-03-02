import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/Authorization/AuthProvider";

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

const messages = {
  en: messages_en,
  cs: messages_cs,
  fr: messages_fr,
  de_en: messages_de_en,
  de_cz: messages_de_cz,
  es: messages_es,
};

export const TranslationContext = createContext();

const TranslationProvider = ({ children }) => {
  const [language, _setLanguage] = useState(
    window.sessionStorage.getItem("language") || "en"
  );
  const setLanguage = useCallback((lang) => {
    _setLanguage(lang);
    window.sessionStorage.setItem("language", lang);
  }, []);

  return (
    <TranslationContext.Provider value={{ language, setLanguage }}>
      <IntlProvider
        // messages={{ exampleMessageId: "Example message" }}
        locale={language}
        defaultLocale="en"
        messages={messages[language]}
      >
        {children}
      </IntlProvider>
    </TranslationContext.Provider>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <TranslationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <RightMenuProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </RightMenuProvider>
          </AuthProvider>
        </LocalizationProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}
