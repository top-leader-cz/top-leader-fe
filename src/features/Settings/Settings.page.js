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

export const WHITE_BG = { "& .MuiOutlinedInput-root": { bgcolor: "white" } };

const TABS = {
  PROFILE: "PROFILE",
  GENERAL: "GENERAL",
  AVAILABILITY: "AVAILABILITY",
  ADMIN: "ADMIN",
  COMPANIES: "COMPANIES",
};

function SettingsPageInner() {
  // const [tab, setTab] = useState(TABS.AVAILABILITY);
  const msg = useMsg();
  const { isCoach, isAdmin } = useAuth();

  const tabs = useMemo(() => {
    const tabs = [
      {
        key: TABS.PROFILE,
        // visible: isCoach && !isAdmin,
        visible: isCoach,
        label: msg("settings.tabs.profile.label"),
        Component: ProfileSettings,
      },
      {
        visible: true,
        key: TABS.GENERAL,
        label: msg("settings.tabs.general.label"),
        Component: GeneralSettings,
      },
      {
        // visible: isCoach && !isAdmin,
        visible: isCoach,
        key: TABS.AVAILABILITY,
        label: msg("settings.tabs.availability.label"),
        Component: AvailabilitySettings,
      },
      {
        visible: isAdmin,
        key: TABS.ADMIN,
        label: msg("settings.tabs.admin.label"),
        Component: AdminSettings,
      },
      {
        visible: isAdmin,
        key: TABS.COMPANIES,
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
