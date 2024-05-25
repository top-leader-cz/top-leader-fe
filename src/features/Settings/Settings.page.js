import { useMemo } from "react";
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { useAuth } from "../Authorization";
import { AvailabilitySettings } from "./AvailabilitySettings";
import { GeneralSettings } from "./GeneralSettings";
import { messages } from "./messages";
import { ProfileSettings } from "./ProfileSettings";
import { TLTabs } from "./Tabs";
import { AdminSettings } from "./AdminSettings";
import { prop } from "ramda";
import { ErrorBoundary } from "react-error-boundary";
import { CompaniesSettings } from "./CompaniesSettings";
import { UserProfileSettings } from "./UserProfileSettings";
import { useSessionStorage } from "../../hooks/useLocalStorage";
import { UserCreditsSettings } from "./UserCreditsSettings";

export const WHITE_BG = { "& .MuiOutlinedInput-root": { bgcolor: "white" } };

export const SETTINGS_TABS = {
  PROFILE: "PROFILE",
  USER_PROFILE: "USER_PROFILE",
  GENERAL: "GENERAL",
  USER_CREDITS: "USER_CREDITS",
  AVAILABILITY: "AVAILABILITY",
  ADMIN: "ADMIN",
  COMPANIES: "COMPANIES",
};

export const useDevMode = () => {
  return useSessionStorage("_devMode", false);
};

function SettingsPageInner() {
  const msg = useMsg();
  const { isCoach, isAdmin } = useAuth();

  const tabs = useMemo(() => {
    const tabs = [
      {
        key: SETTINGS_TABS.PROFILE,
        visible: isCoach,
        label: msg("settings.tabs.profile.label"),
        Component: ProfileSettings,
      },
      {
        visible: true,
        key: SETTINGS_TABS.GENERAL,
        label: msg("settings.tabs.general.label"),
        Component: GeneralSettings,
      },
      {
        visible: !isCoach,
        key: SETTINGS_TABS.USER_PROFILE,
        label: msg("settings.tabs.profile.label"),
        Component: UserProfileSettings,
      },
      {
        visible: true,
        key: SETTINGS_TABS.USER_CREDITS,
        label: msg("settings.tabs.credits.label"),
        Component: UserCreditsSettings,
      },
      {
        visible: isCoach,
        key: SETTINGS_TABS.AVAILABILITY,
        label: msg("settings.tabs.availability.label"),
        Component: AvailabilitySettings,
      },
      {
        visible: isAdmin,
        key: SETTINGS_TABS.ADMIN,
        label: msg("settings.tabs.admin.label"),
        Component: AdminSettings,
      },
      {
        visible: isAdmin,
        key: SETTINGS_TABS.COMPANIES,
        // label: msg("settings.tabs.admin.companies"),
        label: "Companies",
        Component: CompaniesSettings,
      },
    ].filter(prop("visible"));
    return tabs;
  }, [isAdmin, isCoach, msg]);

  console.log("[SettingsPageInner.rndr]", { tabs });

  return (
    <Layout>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => {
          console.log({ error });
          return error.message;
        }}
      >
        <Header text={msg("settings.heading")} noDivider />
        <TLTabs tabs={tabs} />
      </ErrorBoundary>
    </Layout>
  );
}

export function SettingsPage() {
  return (
    <MsgProvider messages={messages}>
      <SettingsPageInner />
    </MsgProvider>
  );
}
